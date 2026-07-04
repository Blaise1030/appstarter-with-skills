export default defineEventHandler((event) => {
  const query = getQuery(event)
  const tag = typeof query.tag === 'string' ? query.tag : undefined
  return listNotes(tag)
})
