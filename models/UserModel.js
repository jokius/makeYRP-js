import { get } from 'lodash'
import { SheetModel } from './SheetModel'

export class UserModel {
  id = null
  admin = false
  nickname = null
  avatar = {}
  sheet = {}

  setInfo(raw) {
    this.id = raw.id
    this.nickname = raw.nickname
    this.avatar = raw.avatar
    this.admin = Boolean(raw.admin)
    this.sheet = new SheetModel().setInfo(raw.sheet) || {}
    return this
  }

  get imgChat() {
    return get(this, 'avatar.chat', null)
  }

  get imgThumb() {
    return get(this, 'avatar.thumb', null)
  }

  get imgLazy() {
    return get(this, 'avatar.lazy', null)
  }
}
