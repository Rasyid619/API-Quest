/** Book persisted by the service. */
import type CreateBookDto from '../dtos/create-book.dto'

/** A stored book with its unique identifier. */
interface Book extends CreateBookDto {
  /** Unique identifier for the book. */
  id: string
}

export default Book
