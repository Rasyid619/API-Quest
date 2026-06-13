/** Express request augmentation for values attached by this service's middleware. */
import type AccessTokenPayload from '../jwt/access-token-payload'

declare global {
  namespace Express {
    interface Request {
      /** Query parameters validated and parsed by requestValidator. */
      parsedQuery?: unknown
      /** Validated access-token payload set by the verify-token middleware. */
      accessTokenPayload?: AccessTokenPayload
      /** Convenience copy of the authenticated user id. */
      user_id?: string
    }
  }
}

export {}
