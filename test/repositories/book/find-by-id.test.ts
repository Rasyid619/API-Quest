/** Database-backed tests for finding books by id. */
import findBookById from '../../../src/repositories/book/find-by-id'
import getPgPool from '../../../src/helpers/pg-pool'
import insertBook from '../../../src/repositories/book/insert'
import { randomUUID } from 'node:crypto'

describe('findBookById', () => {
  beforeEach(async () => {
    await getPgPool().query('TRUNCATE books')
  })

  afterAll(async () => {
    await getPgPool().end()
  })

  describe('when a book matches', () => {
    it('returns the book', async () => {
      const book = { id: randomUUID(), title: 'Dune', author: 'Herbert', year: 1965 }
      await insertBook(book)

      const found = await findBookById(book.id)

      expect(found).toEqual(book)
    })
  })

  describe('when no book matches', () => {
    it('returns undefined', async () => {
      const found = await findBookById(randomUUID())

      expect(found).toBeUndefined()
    })
  })
})
