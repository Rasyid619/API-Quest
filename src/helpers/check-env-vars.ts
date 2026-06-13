/**
 * Asserts that every required environment variable is present and non-empty,
 * exiting the process when any are missing.
 *
 * @param envVarDict - Environment variable dictionary.
 * @param requiredEnvVarNames - Names that must be present and non-empty.
 */
const checkEnvVars = (envVarDict: NodeJS.ProcessEnv, requiredEnvVarNames: string[]): void => {
  /** Names that are absent or empty. */
  const missing = requiredEnvVarNames.filter(name => {
    const value = envVarDict[name]
    return value === undefined || value === ''
  })

  if (missing.length === 0) {
    return
  }

  console.error(`Missing required environment variables: ${missing.join(', ')}.`)
  process.exit(1)
}

export default checkEnvVars
