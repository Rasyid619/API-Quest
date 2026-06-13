/** Ping controller module. */

import { StatusCodes } from 'http-status-codes'
import type SyncMiddleware from '../types/sync-middleware'

/**
 * Responds to a ping request with a 200 OK status and a success payload.
 *
 * @param _request - The Express request object (unused).
 * @param response - The Express response object.
 * @param _next - The Express next function (unused).
 */
const ping: SyncMiddleware = (_request, response, _next) => {
  response.status(StatusCodes.OK).json({ success: true })
}

export default ping
