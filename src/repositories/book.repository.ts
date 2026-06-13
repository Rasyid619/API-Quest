/** Data-access functions for the `books` table. */
import type Book from '../types/entities/book'
import type BookRecord from '../types/query-results/book.record'
import getPgPool from '../helpers/pg-pool'

/** SQL inserting a book and returning its stored columns. */
const INSERT_BOOK_SQL = `
  INSERT INTO books (id, title, author, year)
  VALUES ($1, $2, $3, $4)
  RETURNING id, title, author, year
`

/** SQL selecting all books, newest first. */
const SELECT_BOOKS_SQL = `
  SELECT id, title, author, year
  FROM books
  ORDER BY created_at DESC
`

/** SQL selecting a single book by id. */
const SELECT_BOOK_BY_ID_SQL = `
  SELECT id, title, author, year
  FROM books
  WHERE id = $1
`

/**
 * Maps a raw books row to a Book entity.
 *
 * @param record - Raw books table row.
 * @returns Book entity.
 */
const mapBookRecord = (record: BookRecord): Book => ({
  id: record.id,
  title: record.title,
  author: record.author,
  year: record.year,
})

/**
 * Inserts a book and returns the stored entity.
 *
 * @param book - Book to insert.
 * @returns Stored book.
 */
const insertBook = async (book: Book): Promise<Book> => {
  /** Result of inserting the book. */
  const result = await getPgPool().query<BookRecord>(
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

/**
 * Fetches all books ordered by creation time, newest first.
 *
 * @returns All stored books.
 */
const findBooks = async (): Promise<Book[]> => {
  /** Result of selecting all books. */
  const result = await getPgPool().query<BookRecord>(SELECT_BOOKS_SQL)

  return result.rows.map(mapBookRecord)
}

/**
 * Fetches a single book by id.
 *
 * @param id - Identifier of the book.
 * @returns Matching book, or undefined when none exists.
 */
const findBookById = async (id: string): Promise<Book | undefined> => {
  /** Result of selecting the book by id. */
  const result = await getPgPool().query<BookRecord>(SELECT_BOOK_BY_ID_SQL, [id])

  /** Matching book row, if present. */
  const record = result.rows[0]
  if (!record) {
    return undefined
  }

  return mapBookRecord(record)
}

export { findBookById, findBooks, insertBook }
