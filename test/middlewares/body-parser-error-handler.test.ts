/** Unit tests for the bodyParserErrorHandler middleware. */
import { getMockReq, getMockRes } from '@jest-mock/express'
import { StatusCodes } from 'http-status-codes'
import bodyParserErrorHandler from '../../src/middlewares/body-parser-error-handler'

describe('bodyParserErrorHandler', () => {
  describe('when the error is a JSON body SyntaxError', () => {
    it('responds 400 and does not forward', () => {
      const request = getMockReq()
      const { res: response, next } = getMockRes()
      const error = Object.assign(new SyntaxError('Unexpected token'), { body: '{' })

      bodyParserErrorHandler(error, request, response, next)

      expect(response.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('when the error is unrelated', () => {
    it('forwards it to next', () => {
      const request = getMockReq()
      const { res: response, next } = getMockRes()
      const error = new Error('other')

      bodyParserErrorHandler(error, request, response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
