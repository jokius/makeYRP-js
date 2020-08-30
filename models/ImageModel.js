import * as short from 'short-uuid'
import { AclModel } from '@/models/AclModel'

export class ImageModel {
  id = null
  params = {}
  acl = {}

  setInfo(params) {
    this.id = params.data.id
    const attributes = params.data.attributes
    this.params = { ...attributes.params, name: `image-${this.id}-${short.generate()}` }
    if (params.changeAcl) this.acl = new AclModel().setInfo({ ...params, data: attributes.acl })

    return this
  }
}
