import type Book from '../../types/entities/book'
import type ListBooksQueryDto from '../../types/dtos/book/list-query.dto'
import findBooks from '../../repositories/book/find'

/**
 * Lists a page of books, optionally filtered by author.
 *
 * @param query - Validated author filter and pagination parameters.
 * @returns Matching books on the requested page.
 */
const listBooks = async (query: ListBooksQueryDto): Promise<Book[]> => {
  /** Number of rows to skip for the requested page. */
  const offset = (query.page - 1) * query.limit

  return findBooks({ author: query.author, limit: query.limit, offset })
}

export default listBooks
