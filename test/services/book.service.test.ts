/** Database-backed tests for the book service. */
import * as bookService from '../../src/services/book.service'
import NotFoundError from '../../src/errors/not-found-error'
import getPgPool from '../../src/helpers/pg-pool'
import { randomUUID } from 'node:crypto'

describe('book.service', () => {
  beforeEach(async () => {
    await getPgPool().query('TRUNCATE books')
  })

  afterAll(async () => {
    await getPgPool().end()
  })

  describe('createBook then listBooks', () => {
    it('persists a book with a generated id and lists it', async () => {
      const created = await bookService.createBook({ title: 'Sapiens', author: 'Harari', year: 2011 })

      const books = await bookService.listBooks()

      expect(created.id).toEqual(expect.any(String))
      expect(books).toEqual([created])
    })
  })

  describe('getBook when the book exists', () => {
    it('returns the book', async () => {
      const created = await bookService.createBook({ title: '1984', author: 'Orwell', year: 1949 })

      const book = await bookService.getBook(created.id)

      expect(book).toEqual(created)
    })
  })

  describe('getBook when the book is missing', () => {
    it('throws NotFoundError', async () => {
      await expect(bookService.getBook(randomUUID())).rejects.toThrow(NotFoundError)
    })
  })
})
