export type Role = 'ADMIN' | 'ENTREPRENEUR' | 'CUSTOMER'

type UserProps = {
  name: string
  email: string
  password: string
  avatar?: string | null
  role?: Role
}

export class User {
  id?: string
  name: string
  email: string
  password: string
  avatar?: string | null
  role: Role
  createdAt?: Date
  updatedAt?: Date

  constructor(props: UserProps, id?: string) {
    this.name = props.name
    this.email = props.email
    this.password = props.password
    this.avatar = props.avatar ?? null
    this.role = props.role ?? 'CUSTOMER'

    if (id) this.id = id
  }
}
