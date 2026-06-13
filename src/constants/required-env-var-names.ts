/** Required environment variable constants module. */

/** Environment variable names that must be present for the service to boot. */
const REQUIRED_ENV_VAR_NAMES: string[] = [
  'ACCESS_TOKEN_PUBLIC_KEY',
  'AUTH_PASSWORD',
  'AUTH_USERNAME',
  'DATABASE_URL',
]

export default REQUIRED_ENV_VAR_NAMES
