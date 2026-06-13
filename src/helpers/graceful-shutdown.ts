/** Stops the HTTP server on termination signals. */
import type { Server } from 'node:http'

/**
 * Closes the HTTP server to new connections.
 *
 * @param server - Running HTTP server to stop.
 * @returns Promise that resolves once the server has shut down.
 */
const gracefulShutdown = (server: Server): Promise<void> =>
  new Promise(resolve => {
    server.close(() => resolve())
  })

export default gracefulShutdown
