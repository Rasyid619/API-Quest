/** Integration test covering the books resource end to end. */
import buildApp from '../../src/app'
import getPgPool from '../../src/helpers/pg-pool'
import { randomUUID } from 'node:crypto'
import request from 'supertest'

describe('/books', () => {
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

  describe('filter books by author', () => {
    it('returns only the book whose author matches case-insensitively', async () => {
      const app = buildApp(false)

      const matchResponse = await request(app)
        .post('/books')
        .send({ title: 'It', author: 'Stephen King', year: 1986 })

      await request(app)
        .post('/books')
        .send({ title: 'Dune', author: 'Frank Herbert', year: 1965 })

      const tokenResponse = await request(app)
        .post('/auth/token')
        .send({ username: 'admin', password: 'password' })

      const listResponse = await request(app)
        .get('/books?author=king')
        .set('Authorization', `Bearer ${tokenResponse.body.token}`)

      expect(listResponse.status).toBe(200)
      expect(listResponse.body).toEqual([matchResponse.body])
    })
  })

  describe('paginate books', () => {
    it('returns the requested page of books', async () => {
      const app = buildApp(false)

      await request(app)
        .post('/books')
        .send({ title: 'First', author: 'Author', year: 2001 })

      await request(app)
        .post('/books')
        .send({ title: 'Second', author: 'Author', year: 2002 })

      await request(app)
        .post('/books')
        .send({ title: 'Third', author: 'Author', year: 2003 })

      const tokenResponse = await request(app)
        .post('/auth/token')
        .send({ username: 'admin', password: 'password' })

      const listResponse = await request(app)
        .get('/books?page=2&limit=2')
        .set('Authorization', `Bearer ${tokenResponse.body.token}`)

      expect(listResponse.status).toBe(200)
      expect(listResponse.body).toHaveLength(1)
    })
  })

  describe('reject an invalid query param', () => {
    it('responds 400', async () => {
      const app = buildApp(false)

      const tokenResponse = await request(app)
        .post('/auth/token')
        .send({ username: 'admin', password: 'password' })

      const listResponse = await request(app)
        .get('/books?page=0')
        .set('Authorization', `Bearer ${tokenResponse.body.token}`)

      expect(listResponse.status).toBe(400)
    })
  })

  describe('update a book', () => {
    it('updates the book and persists the new values', async () => {
      const app = buildApp(false)

      const createResponse = await request(app)
        .post('/books')
        .send({ title: 'Clean Code', author: 'Martin', year: 2008 })

      const updateResponse = await request(app)
        .put(`/books/${createResponse.body.id}`)
        .send({ title: 'Clean Architecture', author: 'Uncle Bob', year: 2017 })

      expect(updateResponse.status).toBe(200)
      expect(updateResponse.body).toEqual({
        id: createResponse.body.id,
        title: 'Clean Architecture',
        author: 'Uncle Bob',
        year: 2017,
      })

      const getResponse = await request(app).get(`/books/${createResponse.body.id}`)

      expect(getResponse.status).toBe(200)
      expect(getResponse.body).toEqual(updateResponse.body)
    })
  })

  describe('update a book that does not exist', () => {
    it('responds 404', async () => {
      const app = buildApp(false)

      const updateResponse = await request(app)
        .put(`/books/${randomUUID()}`)
        .send({ title: 'Missing', author: 'Nobody', year: 2000 })

      expect(updateResponse.status).toBe(404)
    })
  })

  describe('delete a book', () => {
    it('deletes the book and makes it unreadable', async () => {
      const app = buildApp(false)

      const createResponse = await request(app)
        .post('/books')
        .send({ title: 'Clean Code', author: 'Martin', year: 2008 })

      const deleteResponse = await request(app).delete(`/books/${createResponse.body.id}`)

      expect(deleteResponse.status).toBe(204)
      expect(deleteResponse.body).toEqual({})

      const getResponse = await request(app).get(`/books/${createResponse.body.id}`)

      expect(getResponse.status).toBe(404)
    })
  })

  describe('delete a book that does not exist', () => {
    it('responds 404', async () => {
      const app = buildApp(false)

      const deleteResponse = await request(app).delete(`/books/${randomUUID()}`)

      expect(deleteResponse.status).toBe(404)
    })
  })

  describe('get a book with a non-uuid id', () => {
    it('responds 404', async () => {
      const app = buildApp(false)

      const getResponse = await request(app).get('/books/nonexistent')

      expect(getResponse.status).toBe(404)
    })
  })

  describe('update a book with a non-uuid id', () => {
    it('responds 404', async () => {
      const app = buildApp(false)

      const updateResponse = await request(app)
        .put('/books/nonexistent')
        .send({ title: 'Ghost', author: 'Nobody', year: 2000 })

      expect(updateResponse.status).toBe(404)
    })
  })

  describe('delete a book with a non-uuid id', () => {
    it('responds 404', async () => {
      const app = buildApp(false)

      const deleteResponse = await request(app).delete('/books/nonexistent')

      expect(deleteResponse.status).toBe(404)
    })
  })
})
