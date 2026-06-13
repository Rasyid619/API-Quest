/** Response body carrying an issued access token. */
interface TokenResponseDto {
  /** Signed JWT bearer token. */
  token: string
}

export default TokenResponseDto
