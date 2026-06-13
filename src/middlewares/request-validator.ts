/** Middleware factory that validates request sections against zod schemas. */
import type { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { ZodType } from 'zod'

/** Zod schemas for the request sections to validate. */
interface RequestSchemas {
  /** Schema for the request body. */
  body?: ZodType
  /** Schema for the route params. */
  path?: ZodType
  /** Schema for the query string. */
  query?: ZodType
}

/**
 * Builds middleware that validates the request body, params, and query against
 * the given zod schemas. On success each validated section is replaced with its
 * parsed value (query is exposed as request.parsedQuery); on failure it responds
 * 400 without leaking validation detail.
 *
 * @param schemas - Schemas to apply, by request section.
 * @returns Express middleware enforcing the schemas.
 */
const requestValidator = (schemas: RequestSchemas): RequestHandler =>
  (request, response, next) => {
    if (schemas.path) {
      const result = schemas.path.safeParse(request.params)
      if (!result.success) {
        response.status(StatusCodes.BAD_REQUEST).send()
        return
      }
      request.params = result.data as typeof request.params
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(request.query)
      if (!result.success) {
        response.status(StatusCodes.BAD_REQUEST).send()
        return
      }
      request.parsedQuery = result.data
    }

    if (schemas.body) {
      const result = schemas.body.safeParse(request.body)
      if (!result.success) {
        response.status(StatusCodes.BAD_REQUEST).send()
        return
      }
      request.body = result.data
    }

    next()
  }

export default requestValidator
