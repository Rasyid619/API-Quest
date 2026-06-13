import { TEST_ACCESS_TOKEN_SECRET } from '../helpers/build-authorization-header'
import buildApp from '../../src/app'
import databaseTest from '../helpers/database-test'
import request from 'supertest'

describe('/auth', () => {
  databaseTest()

  beforeAll(() => {
    process.env.ACCESS_TOKEN_PUBLIC_KEY = TEST_ACCESS_TOKEN_SECRET
    process.env.AUTH_USERNAME = 'admin'
    process.env.AUTH_PASSWORD = 'password'
  })

  describe('login then list books with the token', () => {
    it('issues a token and authorizes the protected books route', async () => {
      const app = buildApp(false)

      const createResponse = await request(app)
        .post('/books')
        .send({ title: 'Clean Code', author: 'Martin', year: 2008 })

      expect(createResponse.status).toBe(201)

      const tokenResponse = await request(app)
        .post('/auth/token')
        .send({ username: 'admin', password: 'password' })

      expect(tokenResponse.status).toBe(200)
      expect(typeof tokenResponse.body.token).toBe('string')

      const listResponse = await request(app)
        .get('/books')
        .set('Authorization', `Bearer ${tokenResponse.body.token}`)

      expect(listResponse.status).toBe(200)
      expect(listResponse.body).toEqual([createResponse.body])
    })
  })
})
