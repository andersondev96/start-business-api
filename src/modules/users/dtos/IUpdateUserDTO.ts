export interface IUpdateUserDTO {
  id: string
  name?: string
  email?: string
  password?: string
  avatar?: string | null
  favorites?: string[]
}
