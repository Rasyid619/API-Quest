/** Unit tests for the requestValidator middleware factory. */
import { getMockReq, getMockRes } from '@jest-mock/express'
import { StatusCodes } from 'http-status-codes'
import requestValidator from '../../src/middlewares/request-validator'
import { z } from 'zod'

describe('requestValidator', () => {
  describe('when body, query, and path all pass', () => {
    it('parses each section, exposes parsedQuery, and calls next', () => {
      const request = getMockReq({ body: { name: 'a' }, query: { limit: '5' }, params: { id: 'x' } })
      const { res: response, next } = getMockRes()

      requestValidator({
        body: z.object({ name: z.string() }),
        query: z.object({ limit: z.coerce.number() }),
        path: z.object({ id: z.string() }),
      })(request, response, next)

      expect(request.parsedQuery).toEqual({ limit: 5 })
      expect(next).toHaveBeenCalled()
    })
  })

  describe('when the body fails validation', () => {
    it('responds 400 and does not call next', () => {
      const request = getMockReq({ body: {} })
      const { res: response, next } = getMockRes()

      requestValidator({ body: z.object({ name: z.string() }) })(request, response, next)

      expect(response.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('when the query fails validation', () => {
    it('responds 400', () => {
      const request = getMockReq({ query: { limit: 'abc' } })
      const { res: response, next } = getMockRes()

      requestValidator({ query: z.object({ limit: z.coerce.number() }) })(request, response, next)

      expect(response.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    })
  })

  describe('when the path fails validation', () => {
    it('responds 400', () => {
      const request = getMockReq({ params: {} })
      const { res: response, next } = getMockRes()

      requestValidator({ path: z.object({ id: z.string() }) })(request, response, next)

      expect(response.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    })
  })
})
