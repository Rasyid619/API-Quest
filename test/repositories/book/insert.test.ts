/** Database-backed tests for inserting books. */
import getPgPool from '../../../src/helpers/pg-pool'
import insertBook from '../../../src/repositories/book/insert'
import { randomUUID } from 'node:crypto'

describe('insertBook', () => {
  beforeEach(async () => {
    await getPgPool().query('TRUNCATE books')
  })

  afterAll(async () => {
    await getPgPool().end()
  })

  describe('when a book is inserted', () => {
    it('stores the book and returns it', async () => {
      const book = { id: randomUUID(), title: 'Dune', author: 'Herbert', year: 1965 }

      const inserted = await insertBook(book)

      expect(inserted).toEqual(book)
    })
  })
})
