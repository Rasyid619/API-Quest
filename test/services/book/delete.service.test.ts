/** Unit tests for deleting books. */
import * as bookRepository from '../../../src/repositories/book'
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
    it('deletes inside a transaction and calls the repository once', async () => {
      const runInTransaction = jest
        .spyOn(transactionHelper, 'default')
        .mockImplementation(async (work) => work(transactionClient))
      const deleteBookRecord = jest.spyOn(bookRepository, 'deleteBook').mockResolvedValue(true)

      await deleteBook('book-id')

      expect(runInTransaction).toHaveBeenCalledTimes(1)
      expect(deleteBookRecord).toHaveBeenCalledTimes(1)
      expect(deleteBookRecord).toHaveBeenCalledWith('book-id', transactionClient)
    })
  })

  describe('when the book is missing', () => {
    it('throws NotFoundError after one repository call inside a transaction', async () => {
      const runInTransaction = jest
        .spyOn(transactionHelper, 'default')
        .mockImplementation(async (work) => work(transactionClient))
      const deleteBookRecord = jest.spyOn(bookRepository, 'deleteBook').mockResolvedValue(false)

      await expect(deleteBook('missing-id')).rejects.toThrow(NotFoundError)
      expect(runInTransaction).toHaveBeenCalledTimes(1)
      expect(deleteBookRecord).toHaveBeenCalledTimes(1)
      expect(deleteBookRecord).toHaveBeenCalledWith('missing-id', transactionClient)
    })
  })
})
