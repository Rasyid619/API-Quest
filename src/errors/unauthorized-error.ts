/** Error raised when a request is not authenticated. */
import AppError from './app-error'
import { StatusCodes } from 'http-status-codes'

/** Maps to a 401 Unauthorized response. */
class UnauthorizedError extends AppError {
  /** @param message - Optional internal message for logging. */
  constructor(message?: string) {
    super(StatusCodes.UNAUTHORIZED, message)
  }
}

export default UnauthorizedError
