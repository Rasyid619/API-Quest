/** Delete-book controller module. */
import * as bookService from '../services/book.service'
import type Controller from '../types/controller'
import { StatusCodes } from 'http-status-codes'

/**
 * Deletes the book identified by the validated route id and responds 204.
 *
 * @param request - Express request carrying the validated book id.
 * @param response - Express response object.
 */
const deleteBook: Controller = async (request, response) => {
  /** Validated book id from the route. */
  const id = request.params.id as string

  await bookService.deleteBook(id)

  response.status(StatusCodes.NO_CONTENT).send()
}

export default deleteBook
