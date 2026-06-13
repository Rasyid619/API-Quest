import type { PgQueryRunner } from '../../types/pg'
import getPgPool from '../../helpers/pg-pool'

/** SQL deleting a book by id. */
const DELETE_BOOK_SQL = `
  DELETE FROM books
  WHERE id::text = $1
`

/**
 * Deletes a book by id.
 *
 * @param id - Identifier of the book.
 * @param executor - Pool or transaction client running the query.
 * @returns Whether a row was deleted.
 */
const deleteBook = async (id: string, executor: PgQueryRunner = getPgPool()): Promise<boolean> => {
  /** Result of deleting the book. */
  const result = await executor.query(DELETE_BOOK_SQL, [id])

  return (result.rowCount ?? 0) > 0
}

export default deleteBook
