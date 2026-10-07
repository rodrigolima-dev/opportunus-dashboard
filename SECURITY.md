# Security

This repository is an executable demonstration with fictional records and local configuration. Its shared-key login is intentionally limited to the demo and must not protect real data.

Please do not publish vulnerability details, credentials, or personal data in an issue or pull request. Use GitHub's private vulnerability reporting when available; otherwise, open a brief issue requesting a private reporting channel without including exploit details.

Security-related changes should include tests for the permitted path, denied path, failure behavior, and tenant isolation. The repository provides `npm run security:secrets` and `npm run security:history` for basic pattern checks; manual review remains necessary, including for screenshots and generated files.
