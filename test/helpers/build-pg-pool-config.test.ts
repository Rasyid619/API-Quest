/** Unit tests for the buildPgPoolConfig helper. */
import buildPgPoolConfig from '../../src/helpers/build-pg-pool-config'

describe('buildPgPoolConfig', () => {
  describe('when the connection string requests ssl', () => {
    it('enables tls with relaxed certificate verification', () => {
      const config = buildPgPoolConfig('postgres://u:p@host:5432/db?sslmode=require')

      expect(config).toEqual({
        connectionString: 'postgres://u:p@host:5432/db?sslmode=require',
        ssl: { rejectUnauthorized: false },
      })
    })
  })

  describe('when the connection string does not request ssl', () => {
    it('omits the ssl option', () => {
      const config = buildPgPoolConfig('postgres://u:p@host:5432/db')

      expect(config).toEqual({ connectionString: 'postgres://u:p@host:5432/db' })
    })
  })

  describe('when the connection string is undefined', () => {
    it('omits the ssl option and passes through undefined', () => {
      const config = buildPgPoolConfig(undefined)

      expect(config).toEqual({ connectionString: undefined })
    })
  })
})
