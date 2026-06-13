/** Integration test covering the books resource end to end. */
import buildApp from '../../src/app'
import getPgPool from '../../src/helpers/pg-pool'
import request from 'supertest'

describe('/books', () => {
  beforeEach(async () => {
    await getPgPool().query('TRUNCATE books')
  })

  afterAll(async () => {
    await getPgPool().end()
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

      const listResponse = await request(app).get('/books')

      expect(listResponse.status).toBe(200)
      expect(listResponse.body).toEqual([createResponse.body])

      const getResponse = await request(app).get(`/books/${createResponse.body.id}`)

      expect(getResponse.status).toBe(200)
      expect(getResponse.body).toEqual(createResponse.body)
    })
  })
})
