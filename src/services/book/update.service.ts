import type Book from '../../types/entities/book'
import type CreateBookDto from '../../types/dtos/book/create.dto'
import NotFoundError from '../../errors/not-found-error'
import runInTransaction from '../../helpers/run-in-transaction'
import { updateBook as updateBookRecord } from '../../repositories/book'

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
    const updated = await updateBookRecord(book, client)
    if (!updated) {
      throw new NotFoundError(`Book ${id} not found`)
    }

    return updated
  })
}

export default updateBook
