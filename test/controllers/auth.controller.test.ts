import * as authService from '../../src/services/auth/token.service'
import { StatusCodes } from 'http-status-codes'
import UnauthorizedError from '../../src/errors/unauthorized-error'
import buildApp from '../../src/app'
import request from 'supertest'

describe('/auth controller', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('POST /auth/token with valid credentials', () => {
    it('responds 200 with the token response', async () => {
      const tokenResponse = { token: 'access-token' }
      jest.spyOn(authService, 'issueToken').mockReturnValue(tokenResponse)

      const response = await request(buildApp(false))
        .post('/auth/token')
        .send({ username: 'admin', password: 'password' })

      expect(response.status).toBe(StatusCodes.OK)
      expect(response.body).toEqual(tokenResponse)
      expect(authService.issueToken).toHaveBeenCalledWith({ username: 'admin', password: 'password' })
    })
  })

  describe('POST /auth/token with an invalid body', () => {
    it('responds 400', async () => {
      const issueToken = jest.spyOn(authService, 'issueToken')

      const response = await request(buildApp(false))
        .post('/auth/token')
        .send({ username: 'admin' })

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect(issueToken).not.toHaveBeenCalled()
    })
  })

  describe('POST /auth/token with wrong credentials', () => {
    it('responds 401', async () => {
      jest.spyOn(authService, 'issueToken').mockImplementation(() => {
        throw new UnauthorizedError()
      })

      const response = await request(buildApp(false))
        .post('/auth/token')
        .send({ username: 'admin', password: 'wrong' })

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })
  })
})
