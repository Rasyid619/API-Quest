import * as createBookServiceModule from '../../src/services/book/create.service'
import * as deleteBookServiceModule from '../../src/services/book/delete.service'
import * as getBookServiceModule from '../../src/services/book/get.service'
import * as listBookServiceModule from '../../src/services/book/list.service'
import * as updateBookServiceModule from '../../src/services/book/update.service'
import { TEST_ACCESS_TOKEN_SECRET, buildAuthorizationHeader } from '../helpers/build-authorization-header'
import NotFoundError from '../../src/errors/not-found-error'
import { StatusCodes } from 'http-status-codes'
import buildApp from '../../src/app'
import request from 'supertest'

/** Book fixture returned from mocked services. */
const book = {
  id: 'book-id',
  title: 'Clean Code',
  author: 'Martin',
  year: 2008,
}

describe('/books controller', () => {
  beforeEach(() => {
    process.env.ACCESS_TOKEN_PUBLIC_KEY = TEST_ACCESS_TOKEN_SECRET
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('POST /books with a valid body', () => {
    it('responds 201 with the created book', async () => {
      const createBook = jest.spyOn(createBookServiceModule, 'default').mockResolvedValue(book)

      const response = await request(buildApp(false))
        .post('/books')
        .send({ title: book.title, author: book.author, year: book.year })

      expect(response.status).toBe(StatusCodes.CREATED)
      expect(response.body).toEqual(book)
      expect(createBook).toHaveBeenCalledWith({ title: book.title, author: book.author, year: book.year })
    })
  })

  describe('POST /books with an invalid body', () => {
    it('responds 400', async () => {
      const createBook = jest.spyOn(createBookServiceModule, 'default')

      const response = await request(buildApp(false))
        .post('/books')
        .send({ title: book.title })

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect(createBook).not.toHaveBeenCalled()
    })
  })

  describe('GET /books with a valid token and query', () => {
    it('responds 200 with matching books', async () => {
      const listBooks = jest.spyOn(listBookServiceModule, 'default').mockResolvedValue([book])

      const response = await request(buildApp(false))
        .get('/books?author=martin&page=2&limit=5')
        .set('Authorization', buildAuthorizationHeader())

      expect(response.status).toBe(StatusCodes.OK)
      expect(response.body).toEqual([book])
      expect(listBooks).toHaveBeenCalledWith({ author: 'martin', page: 2, limit: 5 })
    })
  })

  describe('GET /books without a token', () => {
    it('responds 401', async () => {
      const listBooks = jest.spyOn(listBookServiceModule, 'default')

      const response = await request(buildApp(false)).get('/books')

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(listBooks).not.toHaveBeenCalled()
    })
  })

  describe('GET /books with an invalid query', () => {
    it('responds 400', async () => {
      const listBooks = jest.spyOn(listBookServiceModule, 'default')

      const response = await request(buildApp(false))
        .get('/books?page=0')
        .set('Authorization', buildAuthorizationHeader())

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect(listBooks).not.toHaveBeenCalled()
    })
  })

  describe('GET /books/:id when the book exists', () => {
    it('responds 200 with the book', async () => {
      const getBook = jest.spyOn(getBookServiceModule, 'default').mockResolvedValue(book)

      const response = await request(buildApp(false)).get(`/books/${book.id}`)

      expect(response.status).toBe(StatusCodes.OK)
      expect(response.body).toEqual(book)
      expect(getBook).toHaveBeenCalledWith(book.id)
    })
  })

  describe('GET /books/:id when the book is missing', () => {
    it('responds 404', async () => {
      jest.spyOn(getBookServiceModule, 'default').mockRejectedValue(new NotFoundError())

      const response = await request(buildApp(false)).get('/books/missing-id')

      expect(response.status).toBe(StatusCodes.NOT_FOUND)
    })
  })

  describe('PUT /books/:id with a valid body', () => {
    it('responds 200 with the updated book', async () => {
      const updateBook = jest.spyOn(updateBookServiceModule, 'default').mockResolvedValue(book)

      const response = await request(buildApp(false))
        .put(`/books/${book.id}`)
        .send({ title: book.title, author: book.author, year: book.year })

      expect(response.status).toBe(StatusCodes.OK)
      expect(response.body).toEqual(book)
      expect(updateBook).toHaveBeenCalledWith(book.id, {
        title: book.title,
        author: book.author,
        year: book.year,
      })
    })
  })

  describe('PUT /books/:id with an invalid body', () => {
    it('responds 400', async () => {
      const updateBook = jest.spyOn(updateBookServiceModule, 'default')

      const response = await request(buildApp(false))
        .put(`/books/${book.id}`)
        .send({ title: book.title })

      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect(updateBook).not.toHaveBeenCalled()
    })
  })

  describe('PUT /books/:id when the book is missing', () => {
    it('responds 404', async () => {
      jest.spyOn(updateBookServiceModule, 'default').mockRejectedValue(new NotFoundError())

      const response = await request(buildApp(false))
        .put('/books/missing-id')
        .send({ title: book.title, author: book.author, year: book.year })

      expect(response.status).toBe(StatusCodes.NOT_FOUND)
    })
  })

  describe('DELETE /books/:id when the book exists', () => {
    it('responds 204', async () => {
      const deleteBook = jest.spyOn(deleteBookServiceModule, 'default').mockResolvedValue()

      const response = await request(buildApp(false)).delete(`/books/${book.id}`)

      expect(response.status).toBe(StatusCodes.NO_CONTENT)
      expect(deleteBook).toHaveBeenCalledWith(book.id)
    })
  })

  describe('DELETE /books/:id when the book is missing', () => {
    it('responds 404', async () => {
      jest.spyOn(deleteBookServiceModule, 'default').mockRejectedValue(new NotFoundError())

      const response = await request(buildApp(false)).delete('/books/missing-id')

      expect(response.status).toBe(StatusCodes.NOT_FOUND)
    })
  })
})
