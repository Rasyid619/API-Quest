/** Request body for the login endpoint. */
interface LoginDto {
  /** Username submitted by the client. */
  username: string
  /** Password submitted by the client. */
  password: string
}

export default LoginDto
