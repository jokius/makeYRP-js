import { MenuItemModel } from '@/models/MenuItemModel'

export class MenuFolderItemModel {
  id = null
  menuId = null
  name = null
  depth = null
  items = []
  children = []

  setInfo(params) {
    this.id = params.data.id
    const attributes = params.data.attributes
    this.menuId = attributes.menuId
    this.name = attributes.name
    this.depth = attributes.depth
    this.items = attributes.items.map(raw => {
      const item = new MenuItemModel().setInfo({ ...params, data: raw.data })
      if (item.acl.canRead) return item
    }).filter(Boolean)
    this.children = attributes.children.map(child => new MenuFolderItemModel().setInfo({ ...params, data: child.data }))

    return this
  }

  addItem(item) {
    this.items.push(item)
  }

  deleteItem(id) {
    this.items = this.items.filter(item => item.id !== id)
  }
}
