export interface ITokenProvider {
  generateAccessToken(user_id: string): string
  generateRefreshToken(user_id: string, email: string): string
  verifyToken(token: string, isRefreshToken?: boolean): string | null
}
