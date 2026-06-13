/** List-books controller module. */
import * as bookService from '../services/book.service'
import type Controller from '../types/controller'
import type ListBooksQueryDto from '../types/dtos/list-books-query.dto'
import { StatusCodes } from 'http-status-codes'

/**
 * Responds 200 with a paginated page of books, optionally filtered by author.
 *
 * @param request - Express request object carrying the validated query.
 * @param response - Express response object.
 */
const listBooks: Controller = async (request, response) => {
  /** Validated author filter and pagination parameters. */
  const query = request.parsedQuery as ListBooksQueryDto

  /** Paginated envelope of matching books. */
  const result = await bookService.listBooks(query)

  response.status(StatusCodes.OK).json(result)
}

export default listBooks
