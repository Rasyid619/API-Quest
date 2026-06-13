import databaseTest from '../../helpers/database-test'
import findBookById from '../../../src/repositories/book/find-by-id'
import insertBook from '../../../src/repositories/book/insert'
import { randomUUID } from 'node:crypto'

describe('findBookById', () => {
  databaseTest()

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
