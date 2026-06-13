/** Database-backed tests for the book repository. */
import * as bookRepository from '../../src/repositories/book.repository'
import getPgPool from '../../src/helpers/pg-pool'
import { randomUUID } from 'node:crypto'

describe('book.repository', () => {
  beforeEach(async () => {
    await getPgPool().query('TRUNCATE books')
  })

  afterAll(async () => {
    await getPgPool().end()
  })

  describe('insertBook then findBookById', () => {
    it('stores the book and reads it back', async () => {
      const book = { id: randomUUID(), title: 'Dune', author: 'Herbert', year: 1965 }

      const inserted = await bookRepository.insertBook(book)
      const found = await bookRepository.findBookById(book.id)

      expect(inserted).toEqual(book)
      expect(found).toEqual(book)
    })
  })

  describe('findBookById when no book matches', () => {
    it('returns undefined', async () => {
      const found = await bookRepository.findBookById(randomUUID())

      expect(found).toBeUndefined()
    })
  })

  describe('findBooks', () => {
    it('returns every stored book', async () => {
      const book = { id: randomUUID(), title: 'It', author: 'King', year: 1986 }
      await bookRepository.insertBook(book)

      const books = await bookRepository.findBooks({ limit: 100, offset: 0 })

      expect(books).toEqual([book])
    })
  })

  describe('findBooks with an author filter', () => {
    it('returns only books whose author matches case-insensitively', async () => {
      const match = { id: randomUUID(), title: 'It', author: 'Stephen King', year: 1986 }
      const other = { id: randomUUID(), title: 'Dune', author: 'Frank Herbert', year: 1965 }
      await bookRepository.insertBook(match)
      await bookRepository.insertBook(other)

      const books = await bookRepository.findBooks({ author: 'king', limit: 100, offset: 0 })

      expect(books).toEqual([match])
    })
  })

  describe('countBooks', () => {
    it('counts all books and the filtered subset', async () => {
      const match = { id: randomUUID(), title: 'It', author: 'Stephen King', year: 1986 }
      const other = { id: randomUUID(), title: 'Dune', author: 'Frank Herbert', year: 1965 }
      await bookRepository.insertBook(match)
      await bookRepository.insertBook(other)

      const total = await bookRepository.countBooks({})
      const filtered = await bookRepository.countBooks({ author: 'king' })

      expect(total).toBe(2)
      expect(filtered).toBe(1)
    })
  })

  describe('updateBook then findBookById', () => {
    it('stores the new values and reads them back', async () => {
      const book = { id: randomUUID(), title: 'Dune', author: 'Herbert', year: 1965 }
      const changes = { id: book.id, title: 'Dune Messiah', author: 'Herbert', year: 1969 }
      await bookRepository.insertBook(book)

      const updated = await bookRepository.updateBook(changes)
      const found = await bookRepository.findBookById(book.id)

      expect(updated).toEqual(changes)
      expect(found).toEqual(updated)
    })
  })

  describe('updateBook when no book matches', () => {
    it('returns undefined', async () => {
      const changes = { id: randomUUID(), title: 'Missing', author: 'Nobody', year: 2000 }

      const updated = await bookRepository.updateBook(changes)

      expect(updated).toBeUndefined()
    })
  })

  describe('deleteBook then findBookById', () => {
    it('removes the book', async () => {
      const book = { id: randomUUID(), title: 'It', author: 'King', year: 1986 }
      await bookRepository.insertBook(book)

      const deleted = await bookRepository.deleteBook(book.id)
      const found = await bookRepository.findBookById(book.id)

      expect(deleted).toBe(true)
      expect(found).toBeUndefined()
    })
  })

  describe('deleteBook when no book matches', () => {
    it('returns false', async () => {
      const deleted = await bookRepository.deleteBook(randomUUID())

      expect(deleted).toBe(false)
    })
  })
})
