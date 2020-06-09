import { get } from 'lodash'

export class FolderImageModel {
  id = null
  name = ''
  versions = {}
  acl = {}

  setInfo(raw) {
    this.id = raw.id
    this.name = raw.name
    this.versions = raw.versions
    return this
  }

  get imgUrl() {
    return get(this.versions, 'url')
  }

  get imgChat() {
    return get(this.versions, 'chat')
  }

  get imgThumb() {
    return get(this.versions, 'thumb')
  }

  get imgLazy() {
    return get(this.versions, 'lazy')
  }
}
