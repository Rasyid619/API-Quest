/** Zod schema validating the create-book request body. */
import { z } from 'zod'

/** Schema for the POST /books request body. */
const CREATE_BOOK_SCHEMA = z.object({
  /** Title of the book. */
  title: z.string().min(1),
  /** Author of the book. */
  author: z.string().min(1),
  /** Publication year of the book. */
  year: z.number().int(),
})

export default CREATE_BOOK_SCHEMA
