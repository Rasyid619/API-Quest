/* istanbul ignore file */

/** Health-check controller module. */

import { StatusCodes } from 'http-status-codes'
import type SyncMiddleware from '../../types/sync-middleware'

/**
 * Responds to a health check request with a 200 OK status.
 *
 * @param _request - The Express request object (unused).
 * @param response - The Express response object.
 * @param _next - The Express next function (unused).
 */
const health: SyncMiddleware = (_request, response, _next) => {
  response.status(StatusCodes.OK).send()
}

export default health
