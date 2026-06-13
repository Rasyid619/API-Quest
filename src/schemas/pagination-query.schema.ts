/** Zod schema validating and coercing offset/limit pagination query parameters. */
import { z } from 'zod'

/** Schema for `offset` and `limit` query parameters with sane defaults. */
const PAGINATION_QUERY_SCHEMA = z.object({
  /** Number of rows to skip; defaults to 0. */
  offset: z.coerce.number().int().min(0).default(0),
  /** Maximum number of rows to return; defaults to 100. */
  limit: z.coerce.number().int().min(1).max(100).default(100),
})

export default PAGINATION_QUERY_SCHEMA
