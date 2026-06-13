/** Integration test covering the app wiring through the ping endpoint. */
import buildApp from '../../src/app'
import request from 'supertest'

describe('GET /ping', () => {
  describe('when the service is running', () => {
    it('responds 200 with a success payload', async () => {
      const app = buildApp(false)

      const response = await request(app).get('/ping')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ success: true })
    })
  })
})
