/** Shared node-postgres connection pool accessor. */
import type { PgClientPool } from '../types/pg'
import { Pool } from 'pg'
import buildPgPoolConfig from './build-pg-pool-config'

/** Lazily instantiated shared connection pool. */
let pgPool: PgClientPool | undefined

/**
 * Creates a Postgres connection pool from the given connection string.
 *
 * @param connectionString - Postgres connection string from the environment.
 * @returns Node-postgres connection pool.
 */
export const createPgPool = (connectionString: string | undefined = process.env.DATABASE_URL): PgClientPool => (
  new Pool(buildPgPoolConfig(connectionString))
)

/**
 * Returns the shared Postgres connection pool, creating it on first use.
 *
 * @returns Shared node-postgres pool.
 */
export const getPgPool = (): PgClientPool => {
  if (pgPool) {
    return pgPool
  }

  pgPool = createPgPool()
  return pgPool
}

/**
 * Closes the shared Postgres pool and clears the singleton.
 *
 * @returns Promise resolving once the pool is closed.
 */
export const closePgPool = async (): Promise<void> => {
  if (!pgPool) {
    return
  }

  const pool = pgPool
  pgPool = undefined
  await pool.end()
}

export default getPgPool
