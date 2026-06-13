/** Error raised when a requested resource does not exist. */
import AppError from './app-error'
import { StatusCodes } from 'http-status-codes'

/** Maps to a 404 Not Found response. */
class NotFoundError extends AppError {
  /** @param message - Optional internal message for logging. */
  constructor(message?: string) {
    super(StatusCodes.NOT_FOUND, message)
  }
}

export default NotFoundError
