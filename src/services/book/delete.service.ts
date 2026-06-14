import { deleteBook as deleteBookRecord, lockBookById } from '../../repositories/book'
import NotFoundError from '../../errors/not-found-error'
import runInTransaction from '../../helpers/run-in-transaction'

/**
 * Deletes a book by id inside a transaction.
 *
 * @param id - Identifier of the book.
 * @throws {NotFoundError} When no book has the given id.
 */
const deleteBook = async (id: string): Promise<void> => {
  await runInTransaction(async (client) => {
    /** Whether the book row was locked for update. */
    const isLocked = await lockBookById(id, client)
    if (!isLocked) {
      throw new NotFoundError(`Book ${id} not found`)
    }

    await deleteBookRecord(id, client)
  })
}

export default deleteBook
