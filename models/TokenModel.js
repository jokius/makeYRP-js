import * as short from 'short-uuid'
import { AclModel } from './AclModel'

export class TokenModel {
  id = null
  sheetId = null
  name = null
  params = {}
  acl = {}

  setInfo(raw, changeAcl = true) {
    this.id = raw.id
    this.sheetId = raw.sheet_id
    this.name = this.name || `token-${this.id}-${short.generate()}`
    this.params = { ...raw.params, name: this.name }
    if (changeAcl) this.acl = new AclModel().setInfo(raw.acl)
    return this
  }
}
