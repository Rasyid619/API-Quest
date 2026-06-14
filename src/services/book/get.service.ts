import type Book from '../../types/entities/book'
import NotFoundError from '../../errors/not-found-error'
import findBookById from '../../repositories/book/find-by-id'

/**
 * Fetches a single book by id.
 *
 * @param id - Identifier of the book.
 * @returns Matching book.
 * @throws {NotFoundError} When no book has the given id.
 */
const getBook = async (id: string): Promise<Book> => {
  /** Matching book, if it exists. */
  const book = await findBookById(id)
  if (!book) {
    throw new NotFoundError(`Book ${id} not found`)
  }

  return book
}

export default getBook
