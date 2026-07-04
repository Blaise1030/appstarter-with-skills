# Auth

Default: **better-auth**, persisted through its Drizzle adapter. Requires [Database](./database.md) done first.

## Wiring

Apply `codebase-design` first: the session composable is the seam callers use — pages/components should depend on it, never on `better-auth`'s client directly.

1. Install: `pnpm --filter @appstarter/web add better-auth`
2. Configure in `apps/web/server/utils/auth.ts`:
   ```ts
   import { betterAuth } from 'better-auth'
   import { drizzleAdapter } from 'better-auth/adapters/drizzle'

   export const auth = betterAuth({
     database: drizzleAdapter(useDb(), { provider: 'sqlite' /* or 'pg' */ }),
   })
   ```
3. Mount the handler: `apps/web/server/api/auth/[...all].ts`:
   ```ts
   export default defineEventHandler((event) => auth.handler(toWebRequest(event)))
   ```
4. Client composable, e.g. `apps/web/app/composables/useSession.ts`, wraps `better-auth`'s client (`createAuthClient`) per `project-conventions`' composable pattern — only talks to this app's own `/api/auth/*`, never an external URL directly.
5. Protected routes: use a server middleware or per-route check against `auth.api.getSession(...)`; don't invent a separate ad-hoc auth check per route.
6. Verification/reset emails: use the `cloudflare-email-service` skill to send them via better-auth's `sendVerificationEmail`/`sendResetPassword` hooks — don't re-implement email sending here.

## Checklist before considering this done

- [ ] Database section done first
- [ ] better-auth configured with Drizzle adapter
- [ ] Auth API route mounted
- [ ] Session composable added, tested with `registerEndpoint`
- [ ] At least one protected route demonstrating the pattern
- [ ] ADR written (see main skill file)
