/** Database-backed tests for updating books. */
import findBookById from '../../../src/repositories/book/find-by-id'
import getPgPool from '../../../src/helpers/pg-pool'
import insertBook from '../../../src/repositories/book/insert'
import { randomUUID } from 'node:crypto'
import updateBook from '../../../src/repositories/book/update'

describe('updateBook', () => {
  beforeEach(async () => {
    await getPgPool().query('TRUNCATE books')
  })

  afterAll(async () => {
    await getPgPool().end()
  })

  describe('when a book matches', () => {
    it('stores the new values and returns them', async () => {
      const book = { id: randomUUID(), title: 'Dune', author: 'Herbert', year: 1965 }
      const changes = { id: book.id, title: 'Dune Messiah', author: 'Herbert', year: 1969 }
      await insertBook(book)

      const updated = await updateBook(changes)
      const found = await findBookById(book.id)

      expect(updated).toEqual(changes)
      expect(found).toEqual(updated)
    })
  })

  describe('when no book matches', () => {
    it('returns undefined', async () => {
      const changes = { id: randomUUID(), title: 'Missing', author: 'Nobody', year: 2000 }

      const updated = await updateBook(changes)

      expect(updated).toBeUndefined()
    })
  })
})
