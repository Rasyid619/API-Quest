/** Jest global setup applying database migrations before the suite runs. */
import { runner } from 'node-pg-migrate'

/**
 * Runs all pending up migrations against the test database before any test runs.
 *
 * @returns Promise resolving once migrations are applied.
 */
const globalSetup = async (): Promise<void> => {
  await runner({
    databaseUrl: process.env.DATABASE_URL as string,
    dir: 'migrations',
    direction: 'up',
    migrationsTable: 'pgmigrations',
    count: Infinity,
  })
}

export default globalSetup
