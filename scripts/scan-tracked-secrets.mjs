import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const lineDetectors = [
  { name: "resend-api-key", pattern: /\bre_[A-Za-z0-9_-]{20,}\b/ },
  { name: "github-token", pattern: /\b(?:github_pat_[A-Za-z0-9_]{30,}|gh[pousr]_[A-Za-z0-9]{30,})\b/ },
  { name: "openai-api-key", pattern: /\bsk-(?:(?:proj|admin|svcacct)-[A-Za-z0-9_-]{20,}|[A-Za-z0-9]{32,})\b/ },
  { name: "supabase-secret-key", pattern: /\bsb_secret_[A-Za-z0-9_-]{20,}\b/ },
  { name: "aws-access-key", pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/ },
  { name: "private-key", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ }
];

function isPlaceholder(value) {
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    // An invalid escape sequence is not a documented placeholder.
  }
  return /^(?:<[^>]+>|\$\{[^}]+\}|\{\{[^}]+\}\}|\.\.\.)$/.test(decoded);
}

function hasDatabasePassword(line) {
  const match = line.match(/postgres(?:ql)?:\/\/[^:\s/]+:([^@\s/]+)@([^:\s/?]+)/i);
  if (!match || isPlaceholder(match[1])) return false;

  // RFC 2606 reserves `.invalid` for examples and guarantees it cannot resolve.
  // Keeping this exception narrow avoids hiding credentials on ordinary test hosts.
  return !/(?:^|\.)example\.invalid$/i.test(match[2]);
}

function hasSupabaseServiceRoleJwt(line) {
  const candidates = line.match(/[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g) ?? [];

  return candidates.some((candidate) => {
    try {
      const payload = JSON.parse(Buffer.from(candidate.split(".")[1], "base64url").toString("utf8"));
      return payload?.role === "service_role";
    } catch {
      return false;
    }
  });
}

export function scanTextForSecrets(text) {
  const findings = [];

  for (const [index, line] of text.split(/\r?\n/).entries()) {
    for (const detector of lineDetectors) {
      if (detector.pattern.test(line)) {
        findings.push({ detector: detector.name, line: index + 1 });
      }
    }

    if (hasDatabasePassword(line)) {
      findings.push({ detector: "database-url-password", line: index + 1 });
    }
    if (hasSupabaseServiceRoleJwt(line)) {
      findings.push({ detector: "supabase-service-role-jwt", line: index + 1 });
    }
  }

  return findings;
}

export function scanTrackedFiles(repositoryRoot = process.cwd()) {
  const tracked = execFileSync("git", ["ls-files", "-z"], {
    cwd: repositoryRoot,
    encoding: "buffer"
  }).toString("utf8").split("\0").filter(Boolean);
  const findings = [];

  for (const path of tracked) {
    const contents = readFileSync(resolve(repositoryRoot, path));
    if (contents.includes(0)) continue;

    for (const finding of scanTextForSecrets(contents.toString("utf8"))) {
      findings.push({ path, ...finding });
    }
  }

  return findings;
}

export function scanGitPatchForSecrets(patch) {
  const findings = [];
  const seen = new Set();
  let commit = "unknown";
  let path = "unknown";

  for (const line of String(patch ?? "").split(/\r?\n/)) {
    if (line.startsWith("@@COMMIT ")) {
      const candidate = line.slice("@@COMMIT ".length).trim();
      commit = /^[a-f0-9]{40}$/i.test(candidate) ? candidate.toLowerCase() : "unknown";
      path = "unknown";
      continue;
    }

    if (line.startsWith("+++ ")) {
      const candidate = line.slice(4).trim();
      path = candidate === "/dev/null"
        ? "unknown"
        : candidate.startsWith("b/") ? candidate.slice(2) : candidate;
      continue;
    }

    if (!line.startsWith("+") || line.startsWith("+++")) continue;

    for (const { detector } of scanTextForSecrets(line.slice(1))) {
      const key = `${commit}\0${path}\0${detector}`;
      if (seen.has(key)) continue;
      seen.add(key);
      findings.push({ commit, path, detector });
    }
  }

  return findings;
}

export function scanGitHistory(repositoryRoot = process.cwd()) {
  const patch = execFileSync(
    "git",
    [
      "log",
      "--all",
      "--format=@@COMMIT %H",
      "--no-color",
      "--no-ext-diff",
      "--unified=0",
      "--",
      ".",
      ":(exclude)package-lock.json"
    ],
    {
      cwd: repositoryRoot,
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" }
    }
  );

  return scanGitPatchForSecrets(patch);
}

function run() {
  const historyMode = process.argv.slice(2).includes("--git-history");
  const findings = historyMode ? scanGitHistory() : scanTrackedFiles();
  if (findings.length === 0) {
    process.stdout.write(
      historyMode
        ? "No strong credential patterns found in Git history.\n"
        : "No strong credential patterns found in tracked files.\n"
    );
    return;
  }

  process.stderr.write("Potential credentials detected. Values are intentionally redacted:\n");
  for (const finding of findings) {
    if (historyMode) {
      process.stderr.write(`- ${finding.commit} ${finding.path} [${finding.detector}]\n`);
    } else {
      process.stderr.write(`- ${finding.path}:${finding.line} [${finding.detector}]\n`);
    }
  }
  process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  run();
}
