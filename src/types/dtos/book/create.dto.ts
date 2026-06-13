/** Request body for creating a book. */
interface CreateBookDto {
  /** Title of the book. */
  title: string
  /** Author of the book. */
  author: string
  /** Publication year of the book. */
  year: number
}

export default CreateBookDto
