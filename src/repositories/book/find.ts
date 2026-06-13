import type Book from '../../types/entities/book'
import type BookListFilter from '../../types/services/book/book-list-filter'
import type BookRecord from '../../types/query-results/book/book.record'
import getPgPool from '../../helpers/pg-pool'
import mapBookRecord from './map-record'

/** SQL fragment filtering books by a case-insensitive author substring. */
const AUTHOR_FILTER_SQL = `
  WHERE author ILIKE '%' || $1 || '%'
`

/**
 * Fetches a page of books ordered by creation time, newest first, optionally
 * filtered by a case-insensitive author substring.
 *
 * @param filter - Optional author substring plus page limit and offset.
 * @returns Matching books on the requested page.
 */
const findBooks = async (filter: BookListFilter): Promise<Book[]> => {
  /** Whether an author substring filter is present. */
  const hasAuthor = filter.author !== undefined

  /** WHERE clause applied when an author filter is present. */
  const whereClause = hasAuthor ? AUTHOR_FILTER_SQL : ''

  /** Positional parameters for the select query. */
  const params = hasAuthor ? [filter.author, filter.limit, filter.offset] : [filter.limit, filter.offset]

  /** SQL selecting the requested page of books. */
  const selectSql = `
    SELECT id, title, author, year
    FROM books
    ${whereClause}
    ORDER BY created_at DESC, id DESC
    LIMIT $${hasAuthor ? 2 : 1} OFFSET $${hasAuthor ? 3 : 2}
  `

  /** Result of selecting the page of books. */
  const result = await getPgPool().query<BookRecord>(selectSql, params)

  return result.rows.map(mapBookRecord)
}

export default findBooks
