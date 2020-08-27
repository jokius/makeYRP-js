import { AclModel } from '@/models/AclModel'

export class MenuItemModel {
  id = null
  menuId = null
  folderId = null
  params = {}
  acl = {}

  setInfo(params) {
    this.id = params.data.id
    const attributes = params.data.attributes
    this.menuId = attributes.menuId
    this.folderId = attributes.folderId

    this.params = attributes.params
    if (params.changeAcl) this.acl = new AclModel().setInfo({ ...params, data: attributes.acl })

    return this
  }
}
