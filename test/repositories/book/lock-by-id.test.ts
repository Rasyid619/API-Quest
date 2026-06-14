import databaseTest from '../../helpers/database-test'
import insertBook from '../../../src/repositories/book/insert'
import lockBookById from '../../../src/repositories/book/lock-by-id'
import { randomUUID } from 'node:crypto'

describe('lockBookById', () => {
  databaseTest()

  describe('when a book matches', () => {
    it('returns true', async () => {
      const book = { id: randomUUID(), title: 'Dune', author: 'Herbert', year: 1965 }
      await insertBook(book)

      const isLocked = await lockBookById(book.id)

      expect(isLocked).toBe(true)
    })
  })

  describe('when no book matches', () => {
    it('returns false', async () => {
      const isLocked = await lockBookById(randomUUID())

      expect(isLocked).toBe(false)
    })
  })
})
