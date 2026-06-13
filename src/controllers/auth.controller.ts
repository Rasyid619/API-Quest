/** Auth controller module. */
import * as authService from '../services/auth.service'
import type Controller from '../types/controller'
import type LoginDto from '../types/dtos/login.dto'
import { StatusCodes } from 'http-status-codes'

/**
 * Issues an access token from the validated login body and responds 200 with it.
 *
 * @param request - Express request carrying the validated login payload.
 * @param response - Express response object.
 */
const login: Controller = async (request, response) => {
  /** Token response returned by the service. */
  const tokenResponse = authService.issueToken(request.body as LoginDto)

  response.status(StatusCodes.OK).json(tokenResponse)
}

export default login
