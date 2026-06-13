/** Database-backed tests for deleting books. */
import deleteBook from '../../../src/repositories/book/delete'
import findBookById from '../../../src/repositories/book/find-by-id'
import getPgPool from '../../../src/helpers/pg-pool'
import insertBook from '../../../src/repositories/book/insert'
import { randomUUID } from 'node:crypto'

describe('deleteBook', () => {
  beforeEach(async () => {
    await getPgPool().query('TRUNCATE books')
  })

  afterAll(async () => {
    await getPgPool().end()
  })

  describe('when a book matches', () => {
    it('removes the book and returns true', async () => {
      const book = { id: randomUUID(), title: 'It', author: 'King', year: 1986 }
      await insertBook(book)

      const deleted = await deleteBook(book.id)
      const found = await findBookById(book.id)

      expect(deleted).toBe(true)
      expect(found).toBeUndefined()
    })
  })

  describe('when no book matches', () => {
    it('returns false', async () => {
      const deleted = await deleteBook(randomUUID())

      expect(deleted).toBe(false)
    })
  })
})
