/** Optional case-insensitive author substring filter for book queries. */
interface BookAuthorFilter {
  /** Case-insensitive author substring to match, when filtering. */
  author?: string
}

export default BookAuthorFilter
