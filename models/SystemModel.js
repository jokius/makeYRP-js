export class SystemModel {
  id = null
  name = ''

  setInfo(data) {
    this.id = data.id
    this.name = data.attributes.name

    return this
  }
}
