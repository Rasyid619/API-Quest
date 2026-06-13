/** Zod schema validating and coercing the list-books query parameters. */
import { z } from 'zod'

/** Schema for the `author`, `page`, and `limit` query parameters with sane defaults. */
const LIST_BOOKS_QUERY_SCHEMA = z.object({
  /** Case-insensitive substring to filter authors by; optional. */
  author: z.string().min(1).optional(),
  /** One-based page number; defaults to 1. */
  page: z.coerce.number().int().min(1).default(1),
  /** Maximum number of rows to return; defaults to 10. */
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export default LIST_BOOKS_QUERY_SCHEMA
