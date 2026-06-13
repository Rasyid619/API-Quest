/* istanbul ignore file */

import REQUIRED_ENV_VAR_NAMES from './constants/required-env-var-names'
import buildApp from './app'
import checkEnvVars from './helpers/check-env-vars'
import decideServerPort from './helpers/decide-server-port'
import gracefulShutdown from './helpers/graceful-shutdown'

checkEnvVars(process.env, REQUIRED_ENV_VAR_NAMES)

/** Server port decided from environment variables. */
const serverPort = decideServerPort(process.env)

/** Express application instance used by the HTTP server. */
const app = buildApp(true)

/** Express server instance. */
const server = app.listen(serverPort, () => {
  console.info(`Server is running on port ${serverPort}.`)
})

/** Gracefully shuts down the server on termination signals. */
const terminationSignalHandler = (): Promise<void> => gracefulShutdown(server)

process.on('SIGINT', terminationSignalHandler)
process.on('SIGTERM', terminationSignalHandler)
