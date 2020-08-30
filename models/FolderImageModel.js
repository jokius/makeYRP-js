import { get } from 'lodash'

export class FolderImageModel {
  id = null
  name = ''
  versions = {}

  setInfo(data) {
    this.id = data.id
    const attributes = data.attributes
    this.name = attributes.name
    this.versions = attributes.versions

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
