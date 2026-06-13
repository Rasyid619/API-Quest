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

      const books = await bookService.listBooks({ page: 1, limit: 10 })

      expect(created.id).toEqual(expect.any(String))
      expect(books).toEqual([created])
    })
  })

  describe('listBooks with an author filter', () => {
    it('returns only the book whose author matches case-insensitively', async () => {
      const match = await bookService.createBook({ title: 'Sapiens', author: 'Harari', year: 2011 })
      await bookService.createBook({ title: 'Dune', author: 'Herbert', year: 1965 })

      const books = await bookService.listBooks({ author: 'harari', page: 1, limit: 10 })

      expect(books).toEqual([match])
    })
  })

  describe('listBooks with pagination', () => {
    it('returns a single book on the second page', async () => {
      await bookService.createBook({ title: 'First', author: 'Author', year: 2001 })
      await bookService.createBook({ title: 'Second', author: 'Author', year: 2002 })
      await bookService.createBook({ title: 'Third', author: 'Author', year: 2003 })

      const books = await bookService.listBooks({ page: 2, limit: 2 })

      expect(books).toHaveLength(1)
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

  describe('updateBook when the book exists', () => {
    it('returns the updated book', async () => {
      const created = await bookService.createBook({ title: '1984', author: 'Orwell', year: 1949 })

      const updated = await bookService.updateBook(created.id, { title: 'Animal Farm', author: 'Orwell', year: 1945 })

      expect(updated).toEqual({ id: created.id, title: 'Animal Farm', author: 'Orwell', year: 1945 })
    })
  })

  describe('updateBook when the book is missing', () => {
    it('throws NotFoundError', async () => {
      const update = bookService.updateBook(randomUUID(), { title: 'Missing', author: 'Nobody', year: 2000 })

      await expect(update).rejects.toThrow(NotFoundError)
    })
  })

  describe('deleteBook when the book exists', () => {
    it('removes the book so getBook rejects', async () => {
      const created = await bookService.createBook({ title: 'Sapiens', author: 'Harari', year: 2011 })

      await bookService.deleteBook(created.id)

      await expect(bookService.getBook(created.id)).rejects.toThrow(NotFoundError)
    })
  })

  describe('deleteBook when the book is missing', () => {
    it('throws NotFoundError', async () => {
      await expect(bookService.deleteBook(randomUUID())).rejects.toThrow(NotFoundError)
    })
  })
})
