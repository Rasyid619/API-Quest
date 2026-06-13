import databaseTest from '../../helpers/database-test'
import insertBook from '../../../src/repositories/book/insert'
import { randomUUID } from 'node:crypto'

describe('insertBook', () => {
  databaseTest()

  describe('when a book is inserted', () => {
    it('stores the book and returns it', async () => {
      const book = { id: randomUUID(), title: 'Dune', author: 'Herbert', year: 1965 }

      const inserted = await insertBook(book)

      expect(inserted).toEqual(book)
    })
  })
})
