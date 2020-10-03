export class SheetFolderModel {
  id = null
  name = null
  depth = null
  sheets = []
  children = []

  setInfo(params) {
    const addSheet = params.addSheet
    this.id = params.data.id
    const attributes = params.data.attributes
    this.name = attributes.name
    this.depth = attributes.depth
    this.sheets = attributes.sheets.map(raw => {
      const sheet = addSheet({ ...params, raw })
      if (sheet.acl.canRead) return sheet
    }).filter(Boolean)
    this.children = attributes.children.map(child => new SheetFolderModel().setInfo({ ...params, data: child.data }))

    return this
  }

  addSheet(sheet) {
    this.sheets.push(sheet)
  }

  deleteSheet(id) {
    this.sheets = this.sheets.filter(item => item.id !== id.toString())
  }
}
