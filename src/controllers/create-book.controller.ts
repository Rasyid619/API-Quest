/** Create-book controller module. */
import * as bookService from '../services/book.service'
import type Controller from '../types/controller'
import type CreateBookDto from '../types/dtos/create-book.dto'
import { StatusCodes } from 'http-status-codes'

/**
 * Creates a book from the validated request body and responds 201 with it.
 *
 * @param request - Express request carrying the validated book payload.
 * @param response - Express response object.
 */
const createBook: Controller = async (request, response) => {
  /** Created book returned by the service. */
  const book = await bookService.createBook(request.body as CreateBookDto)

  response.status(StatusCodes.CREATED).json(book)
}

export default createBook
