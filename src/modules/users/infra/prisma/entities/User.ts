export class User {
  id?: string
  name: string
  email: string
  password: string
  favorites?: string[]
  avatar?: string
  createdAt?: Date
  updatedAt?: Date

  constructor(
    props: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) {
    Object.assign(this, props)
    if (id) this.id = id
  }
}
