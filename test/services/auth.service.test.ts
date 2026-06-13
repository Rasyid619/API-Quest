/** Unit tests for the auth service. */
import * as authService from '../../src/services/auth.service'
import UnauthorizedError from '../../src/errors/unauthorized-error'
import { verify } from 'jsonwebtoken'

/** Symmetric secret used to sign access tokens in tests. */
const SECRET = 'test-secret'

describe('auth.service', () => {
  beforeAll(() => {
    process.env.ACCESS_TOKEN_PUBLIC_KEY = SECRET
    process.env.AUTH_USERNAME = 'admin'
    process.env.AUTH_PASSWORD = 'password'
  })

  describe('issueToken with valid credentials', () => {
    it('returns a signed token carrying the admin user_id', () => {
      const result = authService.issueToken({ username: 'admin', password: 'password' })

      expect(typeof result.token).toBe('string')
      expect(result.token).not.toBe('')

      const decoded = verify(result.token, SECRET)
      expect(decoded).toMatchObject({ user_id: 'admin' })
    })
  })

  describe('issueToken with a wrong username', () => {
    it('throws UnauthorizedError', () => {
      expect(() => authService.issueToken({ username: 'wrong', password: 'password' })).toThrow(UnauthorizedError)
    })
  })

  describe('issueToken with a wrong password', () => {
    it('throws UnauthorizedError', () => {
      expect(() => authService.issueToken({ username: 'admin', password: 'wrong' })).toThrow(UnauthorizedError)
    })
  })
})
