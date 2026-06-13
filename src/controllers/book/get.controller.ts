import type Controller from '../../types/controller'
import { StatusCodes } from 'http-status-codes'
import getBookService from '../../services/book/get.service'

/**
 * Responds 200 with the book identified by the validated route id.
 *
 * @param request - Express request carrying the validated book id.
 * @param response - Express response object.
 */
const getBook: Controller = async (request, response) => {
  /** Validated book id from the route. */
  const id = request.params.id as string

  /** Requested book. */
  const book = await getBookService(id)

  response.status(StatusCodes.OK).json(book)
}

export default getBook
