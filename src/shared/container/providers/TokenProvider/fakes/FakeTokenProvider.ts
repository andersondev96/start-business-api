import { ITokenProvider } from '../models/ITokenProvider'

export class FakeTokenProvider implements ITokenProvider {
  generateAccessToken(user_id: string): string {
    return `fake-access-token-${user_id}`
  }

  generateRefreshToken(user_id: string, email: string): string {
    return `fake-refresh-token-${user_id}`
  }

  verifyToken(token: string): string | null {
    return 'fake-user-id'
  }
}
