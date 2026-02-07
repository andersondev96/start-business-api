import { sign, verify } from 'jsonwebtoken'
import authConfig from '@config/auth' // Seu arquivo de configuração
import { ITokenProvider } from '../models/ITokenProvider'

export class JwtTokenProvider implements ITokenProvider {
  generateAccessToken(user_id: string): string {
    const { secret_token, expires_in_token } = authConfig

    const token = sign({}, secret_token, {
      subject: user_id,
      expiresIn: expires_in_token,
    })

    return token
  }

  generateRefreshToken(user_id: string, email: string): string {
    const { secret_refresh_token, expires_in_refresh_token } = authConfig

    const refreshToken = sign({ email }, secret_refresh_token, {
      subject: user_id,
      expiresIn: expires_in_refresh_token,
    })

    return refreshToken
  }

  verifyToken(token: string, isRefreshToken = false): string | null {
    try {
      const secret = isRefreshToken
        ? authConfig.secret_refresh_token
        : authConfig.secret_token

      const decoded = verify(token, secret)
      return decoded.sub as string
    } catch {
      return null
    }
  }
}
