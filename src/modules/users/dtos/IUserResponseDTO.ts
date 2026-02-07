export interface IUserResponseDTO {
  id: string
  name: string
  email: string
  avatar: string | null
  favorites?: string[]
  createdAt: Date
}
