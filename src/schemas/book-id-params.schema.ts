/** Zod schema validating the book id route parameter. */
import { z } from 'zod'

/** Schema for the `id` path parameter identifying a single book. */
const BOOK_ID_PARAMS_SCHEMA = z.object({
  /** Identifier of the book; any non-empty string, unknown ids resolve to a 404. */
  id: z.string().min(1),
})

export default BOOK_ID_PARAMS_SCHEMA
