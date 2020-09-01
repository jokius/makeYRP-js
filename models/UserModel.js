import { get } from 'lodash'
import { SheetModel } from './SheetModel'

export class UserModel {
  id = null
  admin = false
  nickname = null
  avatar = {}
  sheet = {}

  setInfo({ data }) {
    this.id = data.id
    const attributes = data.attributes
    this.nickname = attributes.nickname
    this.avatar = attributes.avatar
    this.admin = Boolean(attributes.admin)
    this.sheet = new SheetModel().setInfo({ data: attributes.sheet, changeAcl: false }) || {}

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
