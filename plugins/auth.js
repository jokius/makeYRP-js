import { UserModel } from '@/models/UserModel'

export default function ({ $auth }) {
  if (!$auth.loggedIn) return

  $auth.setUser(new UserModel().setInfo($auth.user))
}
