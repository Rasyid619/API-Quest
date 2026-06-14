import type Book from '../../types/entities/book'
import type CreateBookDto from '../../types/dtos/book/create.dto'
import NotFoundError from '../../errors/not-found-error'
import lockBookById from '../../repositories/book/lock-by-id'
import runInTransaction from '../../helpers/run-in-transaction'
import updateBookRecord from '../../repositories/book/update'

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
    /** Whether the book row was locked for update. */
    const isLocked = await lockBookById(id, client)
    if (!isLocked) {
      throw new NotFoundError(`Book ${id} not found`)
    }

    await updateBookRecord(book, client)

    return book
  })
}

export default updateBook
