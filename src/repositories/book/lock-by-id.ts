import type { PgQueryRunner } from '../../types/pg'
import getPgPool from '../../helpers/pg-pool'

/** SQL locking a single book row by id for update, comparing as text so non-UUID ids match nothing. */
const LOCK_BOOK_BY_ID_SQL = 'SELECT id FROM books WHERE id::text = $1 FOR UPDATE'

/**
 * Locks a book row by id for update.
 *
 * @param id - Identifier of the book.
 * @param executor - Pool or transaction client running the query.
 * @returns Whether a matching book row was locked.
 */
const lockBookById = async (id: string, executor: PgQueryRunner = getPgPool()): Promise<boolean> => {
  /** Result of locking the book by id. */
  const result = await executor.query(LOCK_BOOK_BY_ID_SQL, [id])

  return (result.rowCount ?? 0) > 0
}

export default lockBookById
