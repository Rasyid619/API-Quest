/** Unit tests for the shared Postgres pool helper. */
import { closePgPool, createPgPool, getPgPool } from '../../src/helpers/pg-pool'
import type { PgClientPool } from '../../src/types/pg'
import buildPgPoolConfig from '../../src/helpers/build-pg-pool-config'

jest.mock('../../src/helpers/build-pg-pool-config', () => jest.fn((connectionString: string | undefined) => ({
  connectionString,
})))

describe('pg-pool helper', () => {
  afterEach(async () => {
    await closePgPool()
    jest.clearAllMocks()
  })

  describe('createPgPool', () => {
    it('builds a pool from the provided connection string', async () => {
      const connectionString = 'postgres://user:password@localhost:5432/apiquest'

      const pool = createPgPool(connectionString)

      expect(buildPgPoolConfig).toHaveBeenCalledWith(connectionString)
      expect(pool).toHaveProperty('connect')
      expect(pool).toHaveProperty('query')
      await pool.end()
    })
  })

  describe('getPgPool', () => {
    it('returns the same lazily-created pool until it is closed', async () => {
      const first = getPgPool()
      const second = getPgPool()
      const end = jest.spyOn(first as PgClientPool, 'end')

      expect(first).toBe(second)

      await closePgPool()
      const third = getPgPool()

      expect(third).not.toBe(first)
      expect(end).toHaveBeenCalledTimes(1)
    })
  })
})
