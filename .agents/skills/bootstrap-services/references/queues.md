# Queues

Default: **Cloudflare Queues** for background/async work.

## Wiring

Apply `codebase-design` first: the producer call is the seam — callers send a payload through it, unaware of the queue/binding underneath.

1. Add producer/consumer bindings to `apps/web/wrangler.jsonc`:
   ```jsonc
   { "queues": { "producers": [{ "binding": "QUEUE", "queue": "..." }], "consumers": [{ "queue": "..." }] } }
   ```
2. Producer: a `server/api/*` route sends a message via `event.context.cloudflare.env.QUEUE.send(payload)` after handling the request — don't block the response on the async work.
3. Consumer: exported `queue(batch, env)` handler (Nitro/Workers entry point) processes messages; keep handlers idempotent since Queues can redeliver.
4. Only reach for this when work genuinely needs to happen outside the request/response cycle — a same-request DB write doesn't need a queue.

## Checklist before considering this done

- [ ] Producer/consumer bindings present in `wrangler.jsonc`
- [ ] Producer route sends without blocking the response
- [ ] Consumer handler is idempotent
- [ ] ADR written (see main skill file)
