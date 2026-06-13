/** Paginated envelope returned when listing books. */
import type Book from '../entities/book'

/** Page of books with pagination metadata. */
interface PaginatedBooksResponseDto {
  /** Books on the current page. */
  data: Book[]
  /** One-based page number. */
  page: number
  /** Maximum number of rows returned per page. */
  limit: number
  /** Total number of books matching the filter. */
  total: number
}

export default PaginatedBooksResponseDto
