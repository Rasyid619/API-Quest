/** Database-backed tests for finding books. */
import findBooks from '../../../src/repositories/book/find'
import getPgPool from '../../../src/helpers/pg-pool'
import insertBook from '../../../src/repositories/book/insert'
import { randomUUID } from 'node:crypto'

describe('findBooks', () => {
  beforeEach(async () => {
    await getPgPool().query('TRUNCATE books')
  })

  afterAll(async () => {
    await getPgPool().end()
  })

  describe('when books exist', () => {
    it('returns every stored book', async () => {
      const book = { id: randomUUID(), title: 'It', author: 'King', year: 1986 }
      await insertBook(book)

      const books = await findBooks({ limit: 100, offset: 0 })

      expect(books).toEqual([book])
    })
  })

  describe('when an author filter is provided', () => {
    it('returns only books whose author matches case-insensitively', async () => {
      const match = { id: randomUUID(), title: 'It', author: 'Stephen King', year: 1986 }
      const other = { id: randomUUID(), title: 'Dune', author: 'Frank Herbert', year: 1965 }
      await insertBook(match)
      await insertBook(other)

      const books = await findBooks({ author: 'king', limit: 100, offset: 0 })

      expect(books).toEqual([match])
    })
  })

  describe('when limit and offset are provided', () => {
    it('returns only the requested page', async () => {
      const first = { id: randomUUID(), title: 'First', author: 'Author', year: 2001 }
      const second = { id: randomUUID(), title: 'Second', author: 'Author', year: 2002 }
      await insertBook(first)
      await insertBook(second)

      const books = await findBooks({ limit: 1, offset: 1 })

      expect(books).toHaveLength(1)
    })
  })
})
