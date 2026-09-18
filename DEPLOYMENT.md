# Portfolio deployment handoff

This archive contains the complete source code and public assets for the portfolio.

## Run locally

1. Install Node.js 20 or later and pnpm.
2. Run `pnpm install`.
3. Run `pnpm dev`.

## Publish under another person's domain

1. Create a new hosting project in that person's account.
2. Upload this project folder or connect it to that person's Git repository.
3. Build with `pnpm build` and deploy the generated `dist` output as a Workers-compatible app.
4. In the hosting dashboard, add and verify the person's custom subdomain, then map it to the deployed project.

The source archive intentionally does not include this portfolio's current hosting identity, so it can be connected to a different account and domain safely.
