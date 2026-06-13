/** Business logic for authentication and token issuance. */
import type AccessTokenPayload from '../../types/jwt/access-token-payload'
import type LoginDto from '../../types/dtos/auth/login.dto'
import type TokenResponseDto from '../../types/dtos/auth/token-response.dto'
import UnauthorizedError from '../../errors/unauthorized-error'
import { sign } from 'jsonwebtoken'

/**
 * Issues a signed access token for valid login credentials.
 *
 * @param payload - Validated login payload.
 * @returns Response carrying the signed access token.
 * @throws {UnauthorizedError} When the credentials do not match the configured values.
 */
const issueToken = (payload: LoginDto): TokenResponseDto => {
  /** Username accepted by the login endpoint. */
  const expectedUsername = process.env.AUTH_USERNAME
  /** Password accepted by the login endpoint. */
  const expectedPassword = process.env.AUTH_PASSWORD

  if (payload.username !== expectedUsername) {
    throw new UnauthorizedError('Invalid credentials')
  }

  if (payload.password !== expectedPassword) {
    throw new UnauthorizedError('Invalid credentials')
  }

  /** Claims to embed in the access token. */
  const tokenPayload: AccessTokenPayload = {
    user_id: 'admin',
  }

  /** Signed access token. */
  const token = sign(tokenPayload, process.env.ACCESS_TOKEN_PUBLIC_KEY as string)

  return { token }
}

export { issueToken }
