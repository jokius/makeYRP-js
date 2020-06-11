import * as short from 'short-uuid'

export class ImageModel {
  id = null
  params = {}

  setInfo(raw) {
    this.id = raw.id
    this.params = { ...raw.params, name: `image-${this.id}-${short.generate()}` }
    return this
  }
}
