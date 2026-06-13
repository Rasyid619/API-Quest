import { closePgPool, getPgPool } from '../../src/helpers/pg-pool'

/** Table names cleared before each database-backed test. */
const TABLE_NAMES = [
  'books',
]

/**
 * Registers database setup and teardown hooks for a test suite.
 *
 * @returns Nothing.
 */
const databaseTest = (): void => {
  beforeEach(async () => {
    await getPgPool().query(`TRUNCATE ${TABLE_NAMES.join(', ')}`)
  })

  afterAll(async () => {
    await closePgPool()
  })
}

export default databaseTest
