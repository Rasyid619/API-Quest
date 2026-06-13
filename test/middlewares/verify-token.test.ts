/** Unit tests for the verifyToken middleware. */
import { getMockReq, getMockRes } from '@jest-mock/express'
import { StatusCodes } from 'http-status-codes'
import { sign } from 'jsonwebtoken'
import verifyToken from '../../src/middlewares/verify-token'

/** Symmetric secret used as the access-token verification key in tests. */
const SECRET = 'test-secret'

describe('verifyToken', () => {
  beforeAll(() => {
    process.env.ACCESS_TOKEN_PUBLIC_KEY = SECRET
  })

  describe('when the Authorization header is missing', () => {
    it('responds 401', () => {
      const request = getMockReq({ headers: {} })
      const { res: response, next } = getMockRes()

      verifyToken()(request, response, next)

      expect(response.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('when the header is not a Bearer token', () => {
    it('responds 401', () => {
      const request = getMockReq({ headers: { authorization: 'Basic abc' } })
      const { res: response, next } = getMockRes()

      verifyToken()(request, response, next)

      expect(response.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    })
  })

  describe('when the token signature is invalid', () => {
    it('responds 401', () => {
      const token = sign({ user_id: 'u1' }, 'wrong-secret')
      const request = getMockReq({ headers: { authorization: `Bearer ${token}` } })
      const { res: response, next } = getMockRes()

      verifyToken()(request, response, next)

      expect(response.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    })
  })

  describe('when the payload shape is invalid', () => {
    it('responds 401', () => {
      const token = sign({ wrong: 'field' }, SECRET)
      const request = getMockReq({ headers: { authorization: `Bearer ${token}` } })
      const { res: response, next } = getMockRes()

      verifyToken()(request, response, next)

      expect(response.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    })
  })

  describe('when the token is valid', () => {
    it('attaches the payload and calls next', () => {
      const token = sign({ user_id: 'u1' }, SECRET)
      const request = getMockReq({ headers: { authorization: `Bearer ${token}` } })
      const { res: response, next } = getMockRes()

      verifyToken()(request, response, next)

      expect(request.user_id).toBe('u1')
      expect(next).toHaveBeenCalled()
    })
  })
})
