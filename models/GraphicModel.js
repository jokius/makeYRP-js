import short from "short-uuid"
import { AclModel } from './AclModel'

export class GraphicModel {
  id = null
  kind = ''
  params = {}
  acl = {}

  setInfo(raw, changeAcl = true) {
    this.id = raw.id
    this.kind = raw.kind
    this.params = { ...raw.params, name: `graphic-${this.id}-${short.generate()}` }
    if (changeAcl) this.acl = new AclModel().setInfo(raw.acl)
    return this
  }
}
