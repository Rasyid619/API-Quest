/** Helper building node-postgres pool configuration from the environment. */
import type { PoolConfig } from 'pg'

/**
 * Builds the node-postgres pool configuration from a connection string,
 * enabling TLS only when the URL requests it via `sslmode=require`.
 *
 * @param connectionString - Postgres connection string from the environment.
 * @returns Pool configuration for node-postgres.
 */
const buildPgPoolConfig = (connectionString: string | undefined): PoolConfig => {
  /** Whether the connection string requests a TLS connection. */
  const shouldUseSsl = /sslmode=require/i.test(connectionString ?? '')

  if (!shouldUseSsl) {
    return { connectionString }
  }

  return {
    connectionString,
    ssl: { rejectUnauthorized: false },
  }
}

export default buildPgPoolConfig
