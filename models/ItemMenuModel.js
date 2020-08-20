import { AclModel } from '@/models/AclModel'

export class ItemMenuModel {
  id = null
  menuId = null
  params = {}
  acl = {}

  setInfo(raw, changeAcl = true) {
    this.id = raw.id
    this.menuId = raw.menu_id
    this.params = raw.params
    if (changeAcl) this.acl = new AclModel().setInfo(raw.acl)
    return this
  }
}
