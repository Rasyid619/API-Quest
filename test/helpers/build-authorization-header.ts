import { sign } from 'jsonwebtoken'

/** JWT secret used by HTTP route tests. */
export const TEST_ACCESS_TOKEN_SECRET = 'test-secret'

/**
 * Builds a bearer authorization header for route tests.
 *
 * @returns Bearer authorization header.
 */
export const buildAuthorizationHeader = (): string => {
  /** Signed access token carrying the admin user id. */
  const token = sign({ user_id: 'admin' }, TEST_ACCESS_TOKEN_SECRET)

  return `Bearer ${token}`
}
