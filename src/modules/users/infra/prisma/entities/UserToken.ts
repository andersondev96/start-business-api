type UserTokenProps = {
  expires_date: Date
  refresh_token: string
  user_id: string
}

export class UserToken {
  id?: string
  expires_date: Date
  refresh_token: string
  user_id: string
  created_at?: Date
  updated_at?: Date

  private constructor(props: UserTokenProps, id?: string) {
    this.expires_date = props.expires_date
    this.refresh_token = props.refresh_token
    this.user_id = props.user_id
    this.id = id

    if (id) this.id = id
  }
}
