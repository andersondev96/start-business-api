export interface IGoogleAuthResponseDTO {
  user: {
    name: string
    email: string
    avatar: string | null
  }
  token: string
  refresh_token: string
}
