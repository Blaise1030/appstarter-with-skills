# Storage

Default: **Cloudflare R2** for file/image uploads.

## Wiring

Apply `codebase-design` first: the upload route/composable pair is the seam — components never touch the R2 binding or a raw URL directly.

1. Add the binding to `apps/web/wrangler.jsonc`:
   ```jsonc
   { "r2_buckets": [{ "binding": "BUCKET", "bucket_name": "..." }] }
   ```
2. Server route (`apps/web/server/api/upload.post.ts`) reads the multipart body and writes via the binding:
   ```ts
   await event.context.cloudflare.env.BUCKET.put(key, body)
   ```
   Per `project-conventions`, this is the only layer that touches the bucket — composables/components call `/api/upload`, never the binding directly.
3. Serving files back: either a `server/api/files/[key].get.ts` route that streams from the bucket, or a public R2 bucket/custom domain if the content isn't sensitive.
4. Composable (`useUpload.ts`) wraps `$fetch('/api/upload', { method: 'POST', body })`, toasts on success/failure per `project-conventions`.

## Checklist before considering this done

- [ ] R2 binding present in `wrangler.jsonc`
- [ ] Upload route validates file type/size before writing
- [ ] Read path decided (streamed route vs public bucket)
- [ ] Composable + toast wired per project conventions
- [ ] ADR written (see main skill file)
