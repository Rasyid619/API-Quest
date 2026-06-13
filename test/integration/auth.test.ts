/** Integration test covering authentication and the protected books route. */
import buildApp from '../../src/app'
import getPgPool from '../../src/helpers/pg-pool'
import request from 'supertest'

describe('/auth', () => {
  beforeAll(() => {
    process.env.ACCESS_TOKEN_PUBLIC_KEY = 'test-secret'
    process.env.AUTH_USERNAME = 'admin'
    process.env.AUTH_PASSWORD = 'password'
  })

  beforeEach(async () => {
    await getPgPool().query('TRUNCATE books')
  })

  afterAll(async () => {
    await getPgPool().end()
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
      expect(listResponse.body).toEqual({ data: [createResponse.body], page: 1, limit: 10, total: 1 })
    })
  })

  describe('list books without a token', () => {
    it('responds 401', async () => {
      const app = buildApp(false)

      const listResponse = await request(app).get('/books')

      expect(listResponse.status).toBe(401)
    })
  })

  describe('login with wrong credentials', () => {
    it('responds 401', async () => {
      const app = buildApp(false)

      const tokenResponse = await request(app)
        .post('/auth/token')
        .send({ username: 'admin', password: 'wrong' })

      expect(tokenResponse.status).toBe(401)
    })
  })

  describe('login with a missing field', () => {
    it('responds 400', async () => {
      const app = buildApp(false)

      const tokenResponse = await request(app)
        .post('/auth/token')
        .send({ username: 'admin' })

      expect(tokenResponse.status).toBe(400)
    })
  })
})
