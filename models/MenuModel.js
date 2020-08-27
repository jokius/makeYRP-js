export class MenuModel {
  id = null
  type = ''
  params = {}
  rootFolder = {}

  setInfo(raw) {
    this.id = raw.id
    this.type = raw.type
    this.params = raw.params
    return this
  }

  addItemToFolder(item) {
    this.folderById(this.rootFolder, item.folderId).addItem(item)
  }

  folderById(parent, id) {
    let folder = parent.children.find(item => item.id === id.toString())
    if (folder) return folder

    parent.children.forEach(child => {
      if (folder) return
      folder = this.folderById(child, id)
    })

    return folder
  }

  deleteChild(parent, id) {
    let folder = parent.children.find(item => item.id === id.toString())
    if (folder) {
      parent.children = parent.children.filter(item => item.id !== id.toString())
      return true
    }

    parent.children.forEach(child => {
      if (folder) return true
      folder = this.deleteChild(child, id)
    })

    return true
  }
}
