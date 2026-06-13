/** Unit tests for the gracefulShutdown helper. */
import type { Server } from 'node:http'
import gracefulShutdown from '../../src/helpers/graceful-shutdown'

describe('gracefulShutdown', () => {
  describe('when invoked', () => {
    it('closes the server', async () => {
      const server = { close: jest.fn((callback: () => void) => callback()) } as unknown as Server

      await gracefulShutdown(server)

      expect(server.close).toHaveBeenCalled()
    })
  })
})
