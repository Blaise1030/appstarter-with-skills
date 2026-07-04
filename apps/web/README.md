# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## CI/CD

Two GitHub Actions workflows run against this repo:

- **CI** (`.github/workflows/ci.yml`) — on every push/PR to `main`: install, lint, typecheck, test, and build the whole workspace.
- **CD** (`.github/workflows/cd.yml`) — deploys to Cloudflare Workers:
  - On each PR, uploads a Cloudflare Workers preview version (`wrangler versions upload --env preview`) and comments the preview URL on the PR.
  - On a published GitHub release, deploys the release tag to the production Worker (`wrangler deploy --env production`).
