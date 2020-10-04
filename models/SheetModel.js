import { get } from 'lodash'

import { AclModel } from './AclModel'

export class SheetModel {
  id = null
  folderId = null
  name = ''
  params = {}
  sheetType = ''
  acl = {}

  setInfo(params) {
    if (!params.data.id) return

    this.id = params.data.id
    const attributes = params.data?.attributes || params.data
    this.sheetType = attributes.sheetType
    this.name = attributes.name
    this.params = attributes.params
    this.folderId = attributes?.folderId?.toLocaleString() || ''
    if (params.changeAcl) this.acl = new AclModel().setInfo({ ...params, data: attributes.acl })

    return this
  }

  get imgUrl() {
    return get(this.params.img, 'versions.url', '/images/default/blank_char.png')
  }

  get imgChat() {
    return get(this.params.img, 'versions.chat', '/images/default/blank_char_50.png')
  }

  get imgThumb() {
    return get(this.params.img, 'versions.thumb', '/images/default/blank_char_200.png')
  }

  get imgLazy() {
    return get(this.params.img, 'versions.lazy', '/images/default/blank_char_10.png')
  }

  get toChat() {
    return {
      name: this.name,
      imgChat: this.imgChat
    }
  }
}
