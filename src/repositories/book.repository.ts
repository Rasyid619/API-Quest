/** Data-access functions for the `books` table. */
import type { Pool, PoolClient } from 'pg'
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

/** SQL updating a book by id and returning its stored columns. */
const UPDATE_BOOK_SQL = `
  UPDATE books
  SET title = $2, author = $3, year = $4
  WHERE id = $1
  RETURNING id, title, author, year
`

/** SQL deleting a book by id. */
const DELETE_BOOK_SQL = `
  DELETE FROM books
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

/**
 * Updates a book by id and returns the stored entity.
 *
 * @param book - Book carrying the id and new values.
 * @param executor - Pool or transaction client running the query.
 * @returns Updated book, or undefined when none matches the id.
 */
const updateBook = async (book: Book, executor: Pool | PoolClient = getPgPool()): Promise<Book | undefined> => {
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

/**
 * Deletes a book by id.
 *
 * @param id - Identifier of the book.
 * @param executor - Pool or transaction client running the query.
 * @returns Whether a row was deleted.
 */
const deleteBook = async (id: string, executor: Pool | PoolClient = getPgPool()): Promise<boolean> => {
  /** Result of deleting the book. */
  const result = await executor.query(DELETE_BOOK_SQL, [id])

  return (result.rowCount ?? 0) > 0
}

export { deleteBook, findBookById, findBooks, insertBook, updateBook }
