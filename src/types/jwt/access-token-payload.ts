/** Validated access-token payload attached to the request after authentication. */
interface AccessTokenPayload {
  /** Subject identifier of the authenticated user. */
  user_id: string
}

export default AccessTokenPayload
