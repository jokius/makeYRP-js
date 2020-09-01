export class MenuModel {
  id = null
  type = ''
  params = {}
  rootFolder = {}

  setInfo({ data }) {
    this.id = data.id
    const attributes = data.attributes
    this.type = attributes.type
    this.params = attributes.params

    return this
  }

  addItemToFolder(item) {
    this.folderById(this.rootFolder, item.folderId).addItem(item)
  }

  folderById(parent, id) {
    if (parent.id === id) return parent // is root folder

    let folder = parent.children.find(item => item.id === id)
    if (folder) return folder

    parent.children.forEach(child => {
      if (folder) return
      folder = this.folderById(child, id)
    })

    return folder
  }

  deleteChild(parent, id) {
    let folder = parent.children.find(item => item.id === id)
    if (folder) {
      parent.children = parent.children.filter(item => item.id !== id)
      return true
    }

    parent.children.forEach(child => {
      if (folder) return true
      folder = this.deleteChild(child, id)
    })

    return true
  }
}
