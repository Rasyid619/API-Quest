/** Zod schema validating the book id route parameter. */
import { z } from 'zod'

/** Schema for the `id` path parameter identifying a single book. */
const BOOK_ID_PARAMS_SCHEMA = z.object({
  /** UUID identifying the book. */
  id: z.uuid(),
})

export default BOOK_ID_PARAMS_SCHEMA
