import * as bookRepository from '../../../src/repositories/book'
import * as transactionHelper from '../../../src/helpers/run-in-transaction'
import type { PgClient } from '../../../src/types/pg'
import createBook from '../../../src/services/book/create.service'

/** Transaction client passed to repository functions. */
const transactionClient = {} as PgClient

describe('createBook', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('when the payload is valid', () => {
    it('creates a book with a generated id and inserts it once', async () => {
      const payload = { title: 'Sapiens', author: 'Harari', year: 2011 }
      const stored = { id: 'book-id', ...payload }
      const runInTransaction = jest
        .spyOn(transactionHelper, 'default')
        .mockImplementation(async (work) => work(transactionClient))
      const insertBook = jest.spyOn(bookRepository, 'insertBook').mockResolvedValue(stored)

      const created = await createBook(payload)

      expect(created).toEqual(stored)
      expect(runInTransaction).toHaveBeenCalledTimes(1)
      expect(insertBook).toHaveBeenCalledTimes(1)
      expect(insertBook).toHaveBeenCalledWith(
        {
          id: expect.any(String),
          title: payload.title,
          author: payload.author,
          year: payload.year,
        },
        transactionClient,
      )
    })
  })
})
