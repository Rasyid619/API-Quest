import type Controller from '../../types/controller'
import type ListBooksQueryDto from '../../types/dtos/book/list-query.dto'
import { StatusCodes } from 'http-status-codes'
import listBookService from '../../services/book/list.service'

/**
 * Responds 200 with a page of books, optionally filtered by author.
 *
 * @param request - Express request object carrying the validated query.
 * @param response - Express response object.
 */
const listBooks: Controller = async (request, response) => {
  /** Validated author filter and pagination parameters. */
  const query = request.parsedQuery as ListBooksQueryDto

  /** Matching books on the requested page. */
  const books = await listBookService(query)

  response.status(StatusCodes.OK).json(books)
}

export default listBooks
