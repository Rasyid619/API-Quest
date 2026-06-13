import type Book from '../../types/entities/book'
import type CreateBookDto from '../../types/dtos/book/create.dto'
import { insertBook } from '../../repositories/book'
import { randomUUID } from 'node:crypto'

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

  return insertBook(book)
}

export default createBook
