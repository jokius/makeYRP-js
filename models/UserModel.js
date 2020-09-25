import { SheetModel } from './SheetModel'

export class UserModel {
  id = null
  admin = false
  nickname = null
  color = null
  avatar = {}
  sheet = {}

  setInfo({ data }) {
    this.id = data.id
    const attributes = data.attributes
    this.nickname = attributes.nickname
    this.avatar = attributes.avatar
    this.color = attributes.color
    this.admin = Boolean(attributes.admin)
    this.sheet = new SheetModel().setInfo({ data: attributes.sheet, changeAcl: false }) || {}

    return this
  }

  get imgChat() {
    return this.avatar?.chat
  }

  get imgThumb() {
    return this.avatar?.thumb
  }

  get imgLazy() {
    return this.avatar?.lazy
  }
}
