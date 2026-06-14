/** Unit tests for deleting books. */
import * as deleteBookModule from '../../../src/repositories/book/delete'
import * as lockBookByIdModule from '../../../src/repositories/book/lock-by-id'
import * as transactionHelper from '../../../src/helpers/run-in-transaction'
import NotFoundError from '../../../src/errors/not-found-error'
import type { PgClient } from '../../../src/types/pg'
import deleteBook from '../../../src/services/book/delete.service'

/** Transaction client passed to repository functions. */
const transactionClient = {} as PgClient

describe('deleteBook', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('when the book exists', () => {
    it('locks the row then deletes inside a transaction', async () => {
      const runInTransaction = jest
        .spyOn(transactionHelper, 'default')
        .mockImplementation(async (work) => work(transactionClient))
      const lockBookById = jest.spyOn(lockBookByIdModule, 'default').mockResolvedValue(true)
      const deleteBookRecord = jest.spyOn(deleteBookModule, 'default').mockResolvedValue(true)

      await deleteBook('book-id')

      expect(runInTransaction).toHaveBeenCalledTimes(1)
      expect(lockBookById).toHaveBeenCalledTimes(1)
      expect(lockBookById).toHaveBeenCalledWith('book-id', transactionClient)
      expect(deleteBookRecord).toHaveBeenCalledTimes(1)
      expect(deleteBookRecord).toHaveBeenCalledWith('book-id', transactionClient)
    })
  })

  describe('when the book is missing', () => {
    it('throws NotFoundError without deleting the record', async () => {
      jest
        .spyOn(transactionHelper, 'default')
        .mockImplementation(async (work) => work(transactionClient))
      const lockBookById = jest.spyOn(lockBookByIdModule, 'default').mockResolvedValue(false)
      const deleteBookRecord = jest.spyOn(deleteBookModule, 'default').mockResolvedValue(false)

      await expect(deleteBook('missing-id')).rejects.toThrow(NotFoundError)
      expect(lockBookById).toHaveBeenCalledTimes(1)
      expect(deleteBookRecord).toHaveBeenCalledTimes(0)
    })
  })
})
