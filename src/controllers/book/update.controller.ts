import type Controller from '../../types/controller'
import type CreateBookDto from '../../types/dtos/book/create.dto'
import { StatusCodes } from 'http-status-codes'
import updateBookService from '../../services/book/update.service'

/**
 * Updates the book identified by the validated route id and responds 200 with it.
 *
 * @param request - Express request carrying the validated book id and payload.
 * @param response - Express response object.
 */
const updateBook: Controller = async (request, response) => {
  /** Validated book id from the route. */
  const id = request.params.id as string

  /** Updated book returned by the service. */
  const book = await updateBookService(id, request.body as CreateBookDto)

  response.status(StatusCodes.OK).json(book)
}

export default updateBook
