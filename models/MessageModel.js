import { UserModel } from './UserModel'

export class MessageModel {
  id = null
  body = {}
  createdAt = ''
  user = {}

  setInfo({ data, included }) {
    this.id = data.id
    const attributes = data.attributes
    this.body = attributes.body
    this.createdAt = attributes.createdAt
    const userId = data.relationships.user.data.id
    const userData = included.find(item => item.type === 'shortUser' && item.id === userId)
    this.user = new UserModel().setInfo({ data: userData })

    return this
  }
}
