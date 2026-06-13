/** Business logic for the books resource. */
import * as bookRepository from '../repositories/book.repository'
import type Book from '../types/entities/book'
import type CreateBookDto from '../types/dtos/create-book.dto'
import NotFoundError from '../errors/not-found-error'
import { randomUUID } from 'node:crypto'
import runInTransaction from '../helpers/run-in-transaction'

/**
 * Creates a book from the given payload.
 *
 * @param payload - Validated book creation payload.
 * @returns Stored book.
 */
const createBook = async (payload: CreateBookDto): Promise<Book> => {
  /** Book entity to persist. */
  const book: Book = {
    id: randomUUID(),
    title: payload.title,
    author: payload.author,
    year: payload.year,
  }

  return bookRepository.insertBook(book)
}

/**
 * Lists all stored books.
 *
 * @returns All books.
 */
const listBooks = async (): Promise<Book[]> => bookRepository.findBooks()

/**
 * Fetches a single book by id.
 *
 * @param id - Identifier of the book.
 * @returns Matching book.
 * @throws {NotFoundError} When no book has the given id.
 */
const getBook = async (id: string): Promise<Book> => {
  /** Matching book, if it exists. */
  const book = await bookRepository.findBookById(id)
  if (!book) {
    throw new NotFoundError(`Book ${id} not found`)
  }

  return book
}

/**
 * Updates a book by id from the given payload inside a transaction.
 *
 * @param id - Identifier of the book.
 * @param payload - Validated book update payload.
 * @returns Updated book.
 * @throws {NotFoundError} When no book has the given id.
 */
const updateBook = async (id: string, payload: CreateBookDto): Promise<Book> => {
  /** Book entity carrying the new values. */
  const book: Book = {
    id,
    title: payload.title,
    author: payload.author,
    year: payload.year,
  }

  return runInTransaction(async (client) => {
    /** Updated book, if it exists. */
    const updated = await bookRepository.updateBook(book, client)
    if (!updated) {
      throw new NotFoundError(`Book ${id} not found`)
    }

    return updated
  })
}

/**
 * Deletes a book by id inside a transaction.
 *
 * @param id - Identifier of the book.
 * @throws {NotFoundError} When no book has the given id.
 */
const deleteBook = async (id: string): Promise<void> => {
  await runInTransaction(async (client) => {
    /** Whether the book was deleted. */
    const deleted = await bookRepository.deleteBook(id, client)
    if (!deleted) {
      throw new NotFoundError(`Book ${id} not found`)
    }
  })
}

export { createBook, deleteBook, getBook, listBooks, updateBook }
