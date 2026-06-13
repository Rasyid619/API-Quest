/** Validated query parameters for listing books. */
interface ListBooksQueryDto {
  /** Case-insensitive substring to filter authors by. */
  author?: string
  /** One-based page number. */
  page: number
  /** Maximum number of rows to return. */
  limit: number
}

export default ListBooksQueryDto
