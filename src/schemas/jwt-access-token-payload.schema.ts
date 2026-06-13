/** Zod schema validating the decoded JWT access-token payload shape. */
import { z } from 'zod'

/** Schema for the claims carried by a verified access token. */
const JWT_ACCESS_TOKEN_PAYLOAD_SCHEMA = z.object({
  /** Subject identifier of the authenticated user. */
  user_id: z.string(),
})

export default JWT_ACCESS_TOKEN_PAYLOAD_SCHEMA
