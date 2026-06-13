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

      const books = await bookRepository.findBooks()

      expect(books).toEqual([book])
    })
  })
})
