/** Zod schema validating the login request body. */
import { z } from 'zod'

/** Schema for the POST /auth/token request body. */
const LOGIN_SCHEMA = z.object({
  /** Username submitted by the client. */
  username: z.string().min(1),
  /** Password submitted by the client. */
  password: z.string().min(1),
})

export default LOGIN_SCHEMA
