import { StatusCodes } from 'http-status-codes'
import buildApp from '../../src/app'
import request from 'supertest'

describe('/core controller', () => {
  describe('POST /echo with a valid body', () => {
    it('responds 200 with the same body', async () => {
      const body = {
        message: 'hello',
        count: 1,
      }

      const response = await request(buildApp(false)).post('/echo').send(body)

      expect(response.status).toBe(StatusCodes.OK)
      expect(response.body).toEqual(body)
    })
  })

  describe('POST /echo with malformed JSON', () => {
    it('responds 400', async () => {
      const response = await request(buildApp(false))
        .post('/echo')
        .set('Content-Type', 'application/json')
        .send('{')

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })
  })

  describe('GET /ping', () => {
    it('responds 200 with a success payload', async () => {
      const response = await request(buildApp(false)).get('/ping')

      expect(response.status).toBe(StatusCodes.OK)
      expect(response.body).toEqual({ success: true })
    })
  })

  describe('GET /health', () => {
    it('responds 200', async () => {
      const response = await request(buildApp(false)).get('/health')

      expect(response.status).toBe(StatusCodes.OK)
    })
  })
})
