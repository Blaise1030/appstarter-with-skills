export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string, tag?: string }>(event)
  try {
    return createNote({ title: body?.title ?? '', tag: body?.tag })
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: 'title is required' })
  }
})
