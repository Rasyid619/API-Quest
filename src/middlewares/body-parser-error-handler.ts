/** Converts malformed JSON body errors from express.json into a 400 response. */
import type { ErrorRequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

/** Catches body-parser SyntaxErrors and responds 400; forwards anything else. */
const bodyParserErrorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    response.status(StatusCodes.BAD_REQUEST).send()
    return
  }

  next(error)
}

export default bodyParserErrorHandler
