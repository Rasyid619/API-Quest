import { TEST_ACCESS_TOKEN_SECRET } from '../helpers/build-authorization-header'
import buildApp from '../../src/app'
import databaseTest from '../helpers/database-test'
import request from 'supertest'

describe('/books', () => {
  databaseTest()

  beforeAll(() => {
    process.env.ACCESS_TOKEN_PUBLIC_KEY = TEST_ACCESS_TOKEN_SECRET
    process.env.AUTH_USERNAME = 'admin'
    process.env.AUTH_PASSWORD = 'password'
  })

  describe('create then read back a book', () => {
    it('creates the book, lists it, and fetches it by id', async () => {
      const app = buildApp(false)

      const createResponse = await request(app)
        .post('/books')
        .send({ title: 'Clean Code', author: 'Martin', year: 2008 })

      expect(createResponse.status).toBe(201)
      expect(createResponse.body).toEqual({
        id: expect.any(String),
        title: 'Clean Code',
        author: 'Martin',
        year: 2008,
      })

      const tokenResponse = await request(app)
        .post('/auth/token')
        .send({ username: 'admin', password: 'password' })

      const listResponse = await request(app)
        .get('/books')
        .set('Authorization', `Bearer ${tokenResponse.body.token}`)

      expect(listResponse.status).toBe(200)
      expect(listResponse.body).toEqual([createResponse.body])

      const getResponse = await request(app).get(`/books/${createResponse.body.id}`)

      expect(getResponse.status).toBe(200)
      expect(getResponse.body).toEqual(createResponse.body)
    })
  })
})
