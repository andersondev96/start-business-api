import { describe, it, expect, beforeEach } from 'vitest'
import BCryptProvider from './BCryptProvider'

let hashProvider: BCryptProvider

describe('BCryptHashProvider', () => {
  beforeEach(() => {
    hashProvider = new BCryptProvider()
  })

  it('should be able to generate a hash', async () => {
    const payload = 'any_password_123'

    const hashed = await hashProvider.generateHash(payload)

    // Verifica se o hash foi gerado
    expect(hashed).toBeTruthy()

    // Verifica se o hash é diferente da senha original
    expect(hashed).not.toBe(payload)

    // Verifica se tem o formato esperado do BCrypt
    expect(hashed.length).toBeGreaterThan(10)
  })

  it('should be able to compare a payload with a hashed value successfully', async () => {
    const payload = 'secret_password'

    const hashed = await hashProvider.generateHash(payload)

    const compare = await hashProvider.compareHash(payload, hashed)

    expect(compare).toBe(true)
  })

  it('should be able to detect when a password does not match the hash', async () => {
    const payload = 'secret_password'

    const hashed = await hashProvider.generateHash(payload)

    const compare = await hashProvider.compareHash('wrong_password', hashed)

    expect(compare).toBe(false)
  })
})
