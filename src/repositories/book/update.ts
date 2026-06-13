import type Book from '../../types/entities/book'
import type BookRecord from '../../types/query-results/book/book.record'
import type { PgQueryRunner } from '../../types/pg'
import getPgPool from '../../helpers/pg-pool'
import mapBookRecord from './map-record'

/** SQL updating a book by id and returning its stored columns. */
const UPDATE_BOOK_SQL = `
  UPDATE books
  SET title = $2, author = $3, year = $4
  WHERE id::text = $1
  RETURNING id, title, author, year
`

/**
 * Updates a book by id and returns the stored entity.
 *
 * @param book - Book carrying the id and new values.
 * @param executor - Pool or transaction client running the query.
 * @returns Updated book, or undefined when none matches the id.
 */
const updateBook = async (book: Book, executor: PgQueryRunner = getPgPool()): Promise<Book | undefined> => {
  /** Result of updating the book. */
  const result = await executor.query<BookRecord>(
    UPDATE_BOOK_SQL,
    [
      book.id,
      book.title,
      book.author,
      book.year,
    ],
  )

  /** Updated book row, if present. */
  const record = result.rows[0]
  if (!record) {
    return undefined
  }

  return mapBookRecord(record)
}

export default updateBook
