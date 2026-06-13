import NotFoundError from '../../errors/not-found-error'
import { deleteBook as deleteBookRecord } from '../../repositories/book'
import runInTransaction from '../../helpers/run-in-transaction'

/**
 * Deletes a book by id inside a transaction.
 *
 * @param id - Identifier of the book.
 * @throws {NotFoundError} When no book has the given id.
 */
const deleteBook = async (id: string): Promise<void> => {
  await runInTransaction(async (client) => {
    /** Whether the book was deleted. */
    const deleted = await deleteBookRecord(id, client)
    if (!deleted) {
      throw new NotFoundError(`Book ${id} not found`)
    }
  })
}

export default deleteBook
