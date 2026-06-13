import type Book from '../../types/entities/book'
import type BookRecord from '../../types/query-results/book/book.record'
import type { PgQueryRunner } from '../../types/pg'
import getPgPool from '../../helpers/pg-pool'
import mapBookRecord from './map-record'

/** SQL selecting a single book by id, comparing as text so non-UUID ids match nothing. */
const SELECT_BOOK_BY_ID_SQL = `
  SELECT id, title, author, year
  FROM books
  WHERE id::text = $1
`

/**
 * Fetches a single book by id.
 *
 * @param id - Identifier of the book.
 * @param executor - Pool or transaction client running the query.
 * @returns Matching book, or undefined when none exists.
 */
const findBookById = async (id: string, executor: PgQueryRunner = getPgPool()): Promise<Book | undefined> => {
  /** Result of selecting the book by id. */
  const result = await executor.query<BookRecord>(SELECT_BOOK_BY_ID_SQL, [id])

  /** Matching book row, if present. */
  const record = result.rows[0]
  if (!record) {
    return undefined
  }

  return mapBookRecord(record)
}

export default findBookById
