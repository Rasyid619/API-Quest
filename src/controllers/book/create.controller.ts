import type Controller from '../../types/controller'
import type CreateBookDto from '../../types/dtos/book/create.dto'
import { StatusCodes } from 'http-status-codes'
import createBookService from '../../services/book/create.service'

/**
 * Creates a book from the validated request body and responds 201 with it.
 *
 * @param request - Express request carrying the validated book payload.
 * @param response - Express response object.
 */
const createBook: Controller = async (request, response) => {
  /** Created book returned by the service. */
  const book = await createBookService(request.body as CreateBookDto)

  response.status(StatusCodes.CREATED).json(book)
}

export default createBook
