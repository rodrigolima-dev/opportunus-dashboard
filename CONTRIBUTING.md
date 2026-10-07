# Contributing

Use a small branch and pull request for each coherent change. Describe the behavior, affected routes, and how you verified it. Keep screenshots and examples fictional.

## Local checks

Use Node.js 24.x and npm 11.x. Install with `npm ci`, then run:

```sh
npm test
npm run typecheck
npm run build
npm run test:http
npm run security:secrets
npm run security:history
```

HTTP tests build and run a local server. Set two different, random local values in `.env.local` as described in the README when exploring the app manually. Never commit that file.

## Review expectations

- Demonstrate both allowed and denied access for any route, role, or tenant change.
- Keep authorization on the server. UI visibility alone is not an access control.
- Use only invented organizations, people, identifiers, amounts, and screenshots.
- Do not include secrets, signed URLs, customer records, operational endpoints, dumps, or real attachments in commits, issues, PRs, or test fixtures.
- Explain any change to session handling, caching, schema, or request validation in the PR.

There is no automatic deployment from this repository. A passing local or CI build does not establish that another environment has been deployed.
