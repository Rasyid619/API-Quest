/** Transaction helper that runs work inside a single Postgres transaction. */
import type { PgClient } from '../types/pg'
import getPgPool from './pg-pool'

/**
 * Runs the given work inside a database transaction, committing on success and
 * rolling back when the work throws.
 *
 * @param work - Callback receiving the transaction-bound client.
 * @returns Value produced by the callback.
 */
const runInTransaction = async <T>(work: (client: PgClient) => Promise<T>): Promise<T> => {
  /** Dedicated client bound to the transaction. */
  const client = await getPgPool().connect()

  try {
    await client.query('BEGIN')
    const result = await work(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export default runInTransaction
