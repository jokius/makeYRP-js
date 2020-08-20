export class MenuModel {
  id = null
  type = ''
  params = {}
  items = []

  setInfo(raw) {
    this.id = raw.id
    this.type = raw.type
    this.params = raw.params
    return this
  }

  addItem(item) {
    this.items.push(item)
  }

  deleteItem(id) {
    this.items = this.items.filter(item => item.id !== id)
  }
}
