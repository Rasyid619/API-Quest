/** List-books controller module. */
import * as bookService from '../services/book.service'
import type Controller from '../types/controller'
import { StatusCodes } from 'http-status-codes'

/**
 * Responds 200 with all stored books.
 *
 * @param _request - Express request object (unused).
 * @param response - Express response object.
 */
const listBooks: Controller = async (_request, response) => {
  /** All stored books. */
  const books = await bookService.listBooks()

  response.status(StatusCodes.OK).json(books)
}

export default listBooks
