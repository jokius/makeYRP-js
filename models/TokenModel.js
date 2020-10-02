import * as short from 'short-uuid'
import { AclModel } from './AclModel'

export class TokenModel {
  id = null
  type = 'token'
  sheetId = null
  name = null
  params = {}
  acl = {}
  layer = ''

  setInfo(params) {
    this.id = params.data.id
    const attributes = params.data.attributes
    this.sheetId = attributes.sheetId.toString()
    this.layer = attributes.layer
    this.name = this.name || `token-${this.id}-${short.generate()}`
    this.params = { ...attributes.params, name: this.name }
    if (params.changeAcl) this.acl = new AclModel().setInfo({ ...params, data: attributes.acl })

    return this
  }
}
