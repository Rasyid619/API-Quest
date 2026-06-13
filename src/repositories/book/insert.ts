import type Book from '../../types/entities/book'
import type BookRecord from '../../types/query-results/book/book.record'
import type { PgQueryRunner } from '../../types/pg'
import getPgPool from '../../helpers/pg-pool'
import mapBookRecord from './map-record'

/** SQL inserting a book and returning its stored columns. */
const INSERT_BOOK_SQL = `
  INSERT INTO books (id, title, author, year)
  VALUES ($1, $2, $3, $4)
  RETURNING id, title, author, year
`

/**
 * Inserts a book and returns the stored entity.
 *
 * @param book - Book to insert.
 * @param executor - Pool or transaction client running the query.
 * @returns Stored book.
 */
const insertBook = async (book: Book, executor: PgQueryRunner = getPgPool()): Promise<Book> => {
  /** Result of inserting the book. */
  const result = await executor.query<BookRecord>(
    INSERT_BOOK_SQL,
    [
      book.id,
      book.title,
      book.author,
      book.year,
    ],
  )

  return mapBookRecord(result.rows[0])
}

export default insertBook
