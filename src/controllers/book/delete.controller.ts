import type Controller from '../../types/controller'
import { StatusCodes } from 'http-status-codes'
import deleteBookService from '../../services/book/delete.service'

/**
 * Deletes the book identified by the validated route id and responds 204.
 *
 * @param request - Express request carrying the validated book id.
 * @param response - Express response object.
 */
const deleteBook: Controller = async (request, response) => {
  /** Validated book id from the route. */
  const id = request.params.id as string

  await deleteBookService(id)

  response.status(StatusCodes.NO_CONTENT).send()
}

export default deleteBook
