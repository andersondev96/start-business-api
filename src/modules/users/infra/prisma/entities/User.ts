export type Role = 'ADMIN' | 'ENTREPRENEUR' | 'CUSTOMER'

export class User {
  id?: string
  name: string
  email: string
  password: string
  avatar?: string | null

  role?: Role

  createdAt?: Date
  updatedAt?: Date

  constructor(
    props: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) {
    Object.assign(this, props)

    if (!this.role) {
      this.role = 'CUSTOMER'
    }

    if (id) this.id = id
  }
}
