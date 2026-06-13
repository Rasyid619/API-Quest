/** Echo controller module. */

import { StatusCodes } from 'http-status-codes'
import type SyncMiddleware from '../../types/sync-middleware'

/**
 * Responds with the exact JSON object received in the request body.
 *
 * @param request - The Express request object.
 * @param response - The Express response object.
 * @param _next - The Express next function (unused).
 */
const echo: SyncMiddleware = (request, response, _next) => {
  response.status(StatusCodes.OK).json(request.body)
}

export default echo
