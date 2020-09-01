import * as short from 'short-uuid'
import { AclModel } from './AclModel'

export class TokenModel {
  id = null
  sheetId = null
  name = null
  params = {}
  acl = {}

  setInfo(params) {
    this.id = params.data.id
    const attributes = params.data.attributes
    this.sheetId = attributes.sheetId.toString()
    this.name = this.name || `token-${this.id}-${short.generate()}`
    this.params = { ...attributes.params, name: this.name }
    if (params.changeAcl) this.acl = new AclModel().setInfo({ ...params, data: attributes.acl })

    return this
  }
}
