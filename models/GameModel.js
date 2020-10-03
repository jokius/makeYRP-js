import { UserModel } from './UserModel'
import { MenuModel } from './MenuModel'
import { PageModel } from './PageModel'

export class GameModel {
  id = null
  name = ''
  master = {}
  users = []
  menus = []
  pages = []
  system = ''
  template = {}
  customTemplate = {}
  rootFolder = {}

  setInfo({ data, included }) {
    this.id = data.id
    const attributes = data.attributes
    this.name = attributes.name
    this.system = attributes.system
    this.template = attributes.template || {}
    this.customTemplate = attributes.customTemplate || {}
    const relationships = data.relationships
    const masterData = included.find(item => item.type === 'shortUser' && item.id === relationships.master.data.id)
    this.master = masterData ? new UserModel().setInfo({ data: masterData }) : {}
    this.users = relationships?.users?.data.map(user => {
      const userData = included.find(item => item.type === 'shortUser' && item.id === user.id)
      return new UserModel().setInfo({ data: userData })
    })

    this.menus = (relationships.menus?.data || []).map(menu => {
      const menuData = included.find(item => item.type === 'menu' && item.id === menu.id)
      return new MenuModel().setInfo({ data: menuData })
    })

    this.pages = (relationships.pages?.data || []).map(page => {
      const pageData = included.find(item => item.type === 'page' && item.id === page.id)
      return new PageModel().setInfo({ data: pageData })
    })

    return this
  }

  getPage(index) {
    return this.pages[index] || {}
  }

  addPage(page) {
    this.pages.push(new PageModel().setInfo(page))

    return this
  }

  deletePage(id) {
    this.pages = this.pages.filter(page => page.id !== id)

    return this
  }

  changePageBackgroundColor(obj) {
    const { id, color } = obj
    const page = this.pages.find(page => page.id === id)
    page.changeBackgroundColor(color)

    return this
  }

  changePageGridColor(obj) {
    const { id, color } = obj
    const page = this.pages.find(page => page.id === id)
    page.changeGridColor(color)

    return this
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

  addSheetToFolder(sheet) {
    this.folderById(this.rootFolder, sheet.folderId).addSheet(sheet)
  }

  get sheetTypes() {
    const types = []
    for (let [key, value] of Object.entries(this.template.sheets)) {
      types.push({ value: key, text: value.name || key })
    }
    return types
  }

  get params() {
    return {
      id: this.id,
      name: this.name,
      custom_template: this.customTemplate
    }
  }
}
