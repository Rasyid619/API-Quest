/** Author filter plus pagination bounds for a page of books. */
import type BookAuthorFilter from './book-author-filter'

/** Author filter combined with the page limit and offset. */
interface BookListFilter extends BookAuthorFilter {
  /** Maximum number of rows to return. */
  limit: number
  /** Number of rows to skip before the page. */
  offset: number
}

export default BookListFilter
