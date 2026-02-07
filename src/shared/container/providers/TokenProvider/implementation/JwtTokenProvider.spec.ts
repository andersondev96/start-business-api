import './JwtTokenProvider'
import { JwtTokenProvider } from './JwtTokenProvider'

let jwtTokenProvider: JwtTokenProvider

describe('JwtAuthTokenProvider', () => {
  beforeEach(() => {
    jwtTokenProvider = new JwtTokenProvider()
  })

  it('should be able to generate a jwt token provider', () => {
    const user_id = 'user-id-123'

    const token = jwtTokenProvider.generateAccessToken(user_id)

    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3)
  })

  it('should be able to generate a refresh jwt token provider', () => {
    const user_id = 'user-id-123'
    const email = 'user@example.com'

    const refreshToken = jwtTokenProvider.generateRefreshToken(user_id, email)

    expect(refreshToken).toBeDefined()
    expect(typeof refreshToken).toBe('string')
    expect(refreshToken.split('.')).toHaveLength(3)
  })

  it('should be able to verify token', () => {
    const user_id = 'user-id-123'

    const token = jwtTokenProvider.generateAccessToken(user_id)

    const decodedId = jwtTokenProvider.verifyToken(token)

    expect(decodedId).toBe(user_id)
  })

  it('should return null when verifying an invalid token', () => {
    const invalidToken = 'invalid.token.structure'

    const result = jwtTokenProvider.verifyToken(invalidToken)

    expect(result).toBeNull()
  })

  it('should return null when verifying a token with wrong secret', () => {
    const result = jwtTokenProvider.verifyToken(
      'djsakldjaskljd.sdajkldjsalkjd.dasjkldjaskl'
    )

    expect(result).toBe(null)
  })
})
