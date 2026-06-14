/** Unit tests for updating books. */
import * as lockBookByIdModule from '../../../src/repositories/book/lock-by-id'
import * as transactionHelper from '../../../src/helpers/run-in-transaction'
import * as updateBookModule from '../../../src/repositories/book/update'
import NotFoundError from '../../../src/errors/not-found-error'
import type { PgClient } from '../../../src/types/pg'
import updateBook from '../../../src/services/book/update.service'

/** Transaction client passed to repository functions. */
const transactionClient = {} as PgClient

describe('updateBook', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('when the book exists', () => {
    it('locks the row then updates inside a transaction', async () => {
      const payload = { title: 'Animal Farm', author: 'Orwell', year: 1945 }
      const updated = { id: 'book-id', ...payload }
      const runInTransaction = jest
        .spyOn(transactionHelper, 'default')
        .mockImplementation(async (work) => work(transactionClient))
      const lockBookById = jest.spyOn(lockBookByIdModule, 'default').mockResolvedValue(true)
      const updateBookRecord = jest.spyOn(updateBookModule, 'default').mockResolvedValue(updated)

      const result = await updateBook(updated.id, payload)

      expect(result).toEqual(updated)
      expect(runInTransaction).toHaveBeenCalledTimes(1)
      expect(lockBookById).toHaveBeenCalledTimes(1)
      expect(lockBookById).toHaveBeenCalledWith(updated.id, transactionClient)
      expect(updateBookRecord).toHaveBeenCalledTimes(1)
      expect(updateBookRecord).toHaveBeenCalledWith(updated, transactionClient)
    })
  })

  describe('when the book is missing', () => {
    it('throws NotFoundError without updating the record', async () => {
      const payload = { title: 'Missing', author: 'Nobody', year: 2000 }
      jest
        .spyOn(transactionHelper, 'default')
        .mockImplementation(async (work) => work(transactionClient))
      const lockBookById = jest.spyOn(lockBookByIdModule, 'default').mockResolvedValue(false)
      const updateBookRecord = jest.spyOn(updateBookModule, 'default').mockResolvedValue(undefined)

      await expect(updateBook('missing-id', payload)).rejects.toThrow(NotFoundError)
      expect(lockBookById).toHaveBeenCalledTimes(1)
      expect(updateBookRecord).toHaveBeenCalledTimes(0)
    })
  })
})
