import short from "short-uuid"
import { AclModel } from './AclModel'

export class GraphicModel {
  id = null
  type = 'graphic'
  kind = ''
  name = null
  params = {}
  acl = {}
  layer = ''

  setInfo(params) {
    this.id = params.data.id
    const attributes = params.data.attributes
    this.kind = attributes.kind
    this.layer = attributes.layer
    this.name = this.name || `graphic-${this.id}-${short.generate()}`
    this.params = { ...attributes.params, name: this.name }
    if (params.changeAcl) this.acl = new AclModel().setInfo({ ...params, data: attributes.acl })

    return this
  }
}
