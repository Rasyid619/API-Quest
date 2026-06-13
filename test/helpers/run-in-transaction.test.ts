import databaseTest from './database-test'
import getPgPool from '../../src/helpers/pg-pool'
import { randomUUID } from 'node:crypto'
import runInTransaction from '../../src/helpers/run-in-transaction'

describe('runInTransaction', () => {
  databaseTest()

  describe('when the work succeeds', () => {
    it('commits the changes and returns the result', async () => {
      const id = randomUUID()

      const result = await runInTransaction(async (client) => {
        await client.query(
          'INSERT INTO books (id, title, author, year) VALUES ($1, $2, $3, $4)',
          [id, 'Committed', 'Author', 2020],
        )
        return 'done'
      })

      const found = await getPgPool().query('SELECT id FROM books WHERE id = $1', [id])

      expect(result).toBe('done')
      expect(found.rowCount).toBe(1)
    })
  })

  describe('when the work throws', () => {
    it('rolls back the changes and rethrows', async () => {
      const id = randomUUID()

      const work = runInTransaction(async (client) => {
        await client.query(
          'INSERT INTO books (id, title, author, year) VALUES ($1, $2, $3, $4)',
          [id, 'Rolled back', 'Author', 2020],
        )
        throw new Error('boom')
      })

      await expect(work).rejects.toThrow('boom')

      const found = await getPgPool().query('SELECT id FROM books WHERE id = $1', [id])

      expect(found.rowCount).toBe(0)
    })
  })
})
