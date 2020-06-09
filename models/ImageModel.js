export class ImageModel {
  id = null
  params = {}

  setInfo(raw, index) {
    this.id = raw.id
    this.params = { ...raw.params, name: `image-${this.id}-${index}` }
    return this
  }
}
