import { JsonWebTokenError, type JwtPayload, verify } from 'jsonwebtoken'
import type AccessTokenPayload from '../types/jwt/access-token-payload'
import JWT_ACCESS_TOKEN_PAYLOAD_SCHEMA from '../schemas/jwt-access-token-payload.schema'
import { StatusCodes } from 'http-status-codes'
import type SyncMiddleware from '../types/sync-middleware'

/** The function signature of the token verifier middleware factory. */
type TokenVerifier = () => SyncMiddleware

/**
 * Builds middleware that validates a bearer access token and attaches its
 * payload to the request. Responds 401 on any missing, malformed, or invalid
 * token without leaking the reason.
 *
 * @returns Express middleware that verifies the token and calls next on success.
 */
const verifyToken: TokenVerifier = () =>
  (request, response, next): void => {
    /** Public key used to verify the access-token signature. */
    const publicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY as string

    if (request.headers.authorization === undefined) {
      response.status(StatusCodes.UNAUTHORIZED).send()
      return
    }

    /** Bearer token split into scheme and credentials. */
    const parsedBearer = request.headers.authorization.split(' ')
    if (parsedBearer.length !== 2 || parsedBearer[0] !== 'Bearer') {
      response.status(StatusCodes.UNAUTHORIZED).send()
      return
    }

    /** Raw bearer token credentials. */
    const rawToken = parsedBearer[1]

    /** Token payload with a verified signature but an unvalidated shape. */
    let rawTokenPayload: JwtPayload | string

    try {
      rawTokenPayload = verify(rawToken, publicKey)
    } catch (error) {
      /* istanbul ignore next */
      if (!(error instanceof JsonWebTokenError) && !(error instanceof SyntaxError)) {
        throw error
      }

      response.status(StatusCodes.UNAUTHORIZED).send()
      return
    }

    /** Result of validating the decoded payload shape. */
    const parseResult = JWT_ACCESS_TOKEN_PAYLOAD_SCHEMA.safeParse(rawTokenPayload)
    if (!parseResult.success) {
      response.status(StatusCodes.UNAUTHORIZED).send()
      return
    }

    request.accessTokenPayload = parseResult.data as AccessTokenPayload
    request.user_id = parseResult.data.user_id
    next()
  }

export default verifyToken
