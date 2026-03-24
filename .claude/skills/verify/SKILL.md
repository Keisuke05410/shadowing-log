---
name: verify
description: Run full lint, type-check, build, and test suite to verify the project is healthy. Use after making changes to confirm nothing is broken.
---

Run the following verification steps in order. Stop at the first failure and report the error.

1. **Lint + format check:** `npm run lint`
2. **Type-check + build:** `npm run build`
3. **Unit tests:** `npm run test`
4. **E2E tests:** `npm run test:e2e`

Report a summary of results: which steps passed, which failed, and any error output.
