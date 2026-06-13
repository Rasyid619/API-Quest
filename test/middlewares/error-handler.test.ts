/** Unit tests for the terminal errorHandler middleware. */
import { getMockReq, getMockRes } from '@jest-mock/express'
import NotFoundError from '../../src/errors/not-found-error'
import { StatusCodes } from 'http-status-codes'
import errorHandler from '../../src/middlewares/error-handler'

describe('errorHandler', () => {
  describe('when the error is an AppError', () => {
    it('responds with the error status code', () => {
      const request = getMockReq()
      const { res: response, next } = getMockRes()

      errorHandler(new NotFoundError(), request, response, next)

      expect(response.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
    })
  })

  describe('when the error is unknown', () => {
    it('responds 500', () => {
      const request = getMockReq()
      const { res: response, next } = getMockRes()
      const log = jest.spyOn(console, 'error').mockImplementation(() => undefined)

      errorHandler(new Error('boom'), request, response, next)

      expect(response.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
      log.mockRestore()
    })
  })
})
