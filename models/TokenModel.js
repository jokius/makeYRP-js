import { AclModel } from './AclModel'

export class TokenModel {
  id = null
  sheetId = null
  params = {}
  acl = {}

  setInfo(raw, index, changeAcl = true) {
    this.id = raw.id
    this.sheetId = raw.sheet_id
    this.params = { ...raw.params, name: `token-${this.id}-${index}` }
    if (changeAcl) this.acl = new AclModel().setInfo(raw.acl)
    return this
  }
}
