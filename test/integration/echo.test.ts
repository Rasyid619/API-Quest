/** Integration test covering the app wiring through the echo endpoint. */
import buildApp from '../../src/app'
import request from 'supertest'

describe('POST /echo', () => {
  describe('when the body is valid JSON', () => {
    it('responds 200 with the same object', async () => {
      const app = buildApp(false)
      const payload = {
        message: 'hello',
        count: 1,
      }

      const response = await request(app).post('/echo').send(payload)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(payload)
    })
  })
})
