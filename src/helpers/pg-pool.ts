/** Shared node-postgres connection pool accessor. */
import { Pool } from 'pg'
import buildPgPoolConfig from './build-pg-pool-config'

/** Lazily instantiated shared connection pool. */
let pgPool: Pool | undefined

/**
 * Returns the shared Postgres connection pool, creating it on first use.
 *
 * @returns Shared node-postgres pool.
 */
const getPgPool = (): Pool => {
  if (pgPool) {
    return pgPool
  }

  pgPool = new Pool(buildPgPoolConfig(process.env.DATABASE_URL))
  return pgPool
}

export default getPgPool
