export class User {
  id?: string
  name: string
  email: string
  password: string
  favorites?: string[]
  avatar?: string
  createdAt?: Date
  updatedAt?: Date

  constructor(props: Partial<User>) {
    return Object.assign(this, props)
  }
}
