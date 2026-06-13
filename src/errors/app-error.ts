/** Base application error carrying an HTTP status code for the error handler. */

/** Error subclass whose status code the terminal error handler maps to a response. */
class AppError extends Error {
  /** HTTP status code to send for this error. */
  readonly statusCode: number

  /**
   * @param statusCode - HTTP status code to send for this error.
   * @param message - Optional internal message for logging.
   */
  constructor(statusCode: number, message?: string) {
    super(message)
    this.name = new.target.name
    this.statusCode = statusCode
  }
}

export default AppError
