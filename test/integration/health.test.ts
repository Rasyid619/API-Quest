/** Integration test covering the app wiring through the health endpoint. */
import buildApp from '../../src/app'
import request from 'supertest'

describe('GET /health', () => {
  describe('when the service is running', () => {
    it('responds 200', async () => {
      const app = buildApp(false)

      const response = await request(app).get('/health')

      expect(response.status).toBe(200)
    })
  })
})
