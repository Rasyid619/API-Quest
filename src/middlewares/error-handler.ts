/** Terminal Express error handler mapping known errors to status codes. */
import AppError from '../errors/app-error'
import type { ErrorRequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

/**
 * Maps AppError instances to their status code and everything else to 500.
 * Never leaks error internals in the response body.
 */
const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).send()
    return
  }

  /* istanbul ignore next */
  console.error(error)
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
}

export default errorHandler
