/** Raw `books` table row as returned by the database driver. */
interface BookRecord {
  /** Unique identifier for the book. */
  id: string
  /** Title of the book. */
  title: string
  /** Author of the book. */
  author: string
  /** Publication year of the book. */
  year: number
}

export default BookRecord
