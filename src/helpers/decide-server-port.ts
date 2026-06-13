/** Default port used when PORT is not set. */
const DEFAULT_PORT = 3000

/**
 * Resolves the server port from PORT, falling back to the default.
 *
 * @param envVarDict - Environment variable dictionary.
 * @returns Positive integer port number.
 * @throws {Error} When PORT is set but is not a positive integer.
 */
const decideServerPort = (envVarDict: NodeJS.ProcessEnv): number => {
  const rawPort = envVarDict.PORT

  if (rawPort === undefined || rawPort === '') {
    return DEFAULT_PORT
  }

  const port = Number(rawPort)

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`PORT is invalid: ${rawPort}`)
  }

  return port
}

export default decideServerPort
