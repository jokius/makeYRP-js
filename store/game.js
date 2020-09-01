import { get, set } from 'lodash'
import { FolderModel } from '@/models/FolderModel'
import { createFolder, deleteFolder, deleteImage, loadFolder, updateFolder, updateImage } from '@/api/folder'
import { handling } from '@/lib/errorsHandling'
import { GameModel } from '@/models/GameModel'
import { loadGame, loadMessages, loadSheets, loadUsers } from '@/api/game'
import { SheetModel } from '@/models/SheetModel'
import { MessageModel } from '@/models/MessageModel'
import { UserModel } from '@/models/UserModel'
import { loadMenuFolders } from '@/api/menu'
import { MenuItemModel } from '@/models/MenuItemModel'
import { MenuFolderItemModel } from '@/models/MenuFolderItemModel'

export const state = () => ({
  info: null,
  currentCursor: 'default',
  currentLayer: 'players',
  openModals: [],
  currentPage: {},
  currentItem: {},
  marks: {},
  sheets: [],
  folder: {},
  foldersLoaded: false,
  loaded: false,
  currentUser: {},
  pageName: null,
  currentRightClickMenu: '',
  messages: [],
  borderSize: 5,
  borderColor: "#000000",
  bodyColor: '#00000000',
  pageColor: {},
  specialTabs: [],
  altPressed: false,
  users: [],
})

export const actions = {
  async load({ commit, state }, { axios, id, user }) {
    try {
      commit('gameLoaded', await loadGame({ axios, id }))
      commit('usersLoaded', await loadUsers({ axios, id }))
      const list = await loadSheets({ axios, id })
      commit('sheetsLoaded', { user, list: list.data })
      commit('messagesLoaded', await loadMessages({ axios, id }))
      const promises = []
      state.info.menus.forEach(menu => {
        promises.push(loadMenuFolders({ axios, id: menu.id }))
      })

      Promise.all(promises).then(result => {
        result.forEach(raw => commit('menuRootFolder', { user, raw }))
        commit('updateCurrentPage', 0)
        commit('setLoaded')
      })
    } catch (error) {
      handling(error)
    }
  },

  async createFolder({ commit }, { axios, params }) {
    try {
      commit('foldersUnloaded')
      commit('foldersLoaded', await createFolder({ axios, params }))
    } catch (error) {
      handling(error)
    }
  },

  async loadFolder({ commit }, { axios, id }) {
    try {
      commit('foldersUnloaded')
      commit('foldersLoaded', await loadFolder({ axios, id }))
    } catch (error) {
      handling(error)
    }
  },

  async renameObj({ commit }, { axios, params }) {
    commit('updateCurrentRightClickMenu', '')
    switch (params.type) {
      case 'folder':
        commit('updateFolder', await updateFolder({ axios, params }))
        break
      case 'image':
        commit('updateImage', await updateImage({ axios, params }))
        break
      default:
        break
    }
  },

  async removeObj({ commit }, { axios, params }) {
    commit('updateCurrentRightClickMenu', '')
    const id = params.id
    switch (params.type) {
      case 'folder':
        await deleteFolder({ axios, id })
        commit('deleteFolder', id)
        break
      case 'image':
        await deleteImage({ axios, id })
        commit('deleteImage', id)
        break
      default:
        break
    }
  },
}

const addSheet = (state, { user, raw }) => {
  const sheet = new SheetModel().setInfo({
    data: raw?.data || raw,
    changeAcl: true,
    currentUserId: user.id,
    masterId: state.info.master.id,
  })
  if (!sheet.acl.canRead) return

  state.sheets = [...state.sheets, sheet]
}

const pushMenuItem = (state, { user, raw }) => {
  const menuItem = new MenuItemModel().setInfo({
    data: raw.data,
    changeAcl: true,
    currentUserId: user.id,
    masterId: state.info.master.id,
  })
  if (!menuItem.acl.canRead) return

  const menu = state.info.menus.find(menu => menu.id === menuItem.menuId)
  menu.addItemToFolder(menuItem)
  return menuItem
}

const deleteSheet = (state, id) => state.sheets = state.sheets.filter(sheet => sheet.id !== id.toString())

export const mutations = {
  gameLoaded(state, game) {
    state.info = new GameModel().setInfo(game)
  },

  sheetsLoaded(state, { list, user }) {
    state.sheets = []
    list.map(raw => addSheet(state, { raw, user }))
  },

  menuRootFolder(state, { raw, user }) {
    const rootFolder = new MenuFolderItemModel().setInfo({
      data: raw.data,
      changeAcl: true,
      currentUserId: user.id,
      masterId: state.info.master.id,
    })

    const menu = state.info.menus.find(menu => menu.id === rootFolder.menuId)
    menu.rootFolder = rootFolder
  },

  changeCurrentCursor(state, value) {
    state.currentCursor = value
  },

  changeCurrentLayer(state, value) {
    state.currentLayer = value
  },

  changeBorderSize(state, value) {
    state.borderSize = value
  },

  addOpenModal(state, params) {
    state.openModals = [...state.openModals, params]
  },

  updateCurrentPage(state, index) {
    state.currentPage = state.info.getPage(index)
  },
  addCurrentItem(state, value) {
    state.currentItem = value
  },

  addMarker(state, mark) {
    state.marks = { ...state.marks, [mark]: 0 }
  },

  resetMarker(state, mark) {
    state.marks = { ...state.marks, [mark]: 0 }
  },

  updateSheetParams(state, { id, path, value, remove = false }) {
    const index = state.sheets.findIndex(item => item.id === id)
    let mutVal = value
    if (remove) {
      mutVal = get(state.sheets[index].params, path, []).slice()
      mutVal.splice(value, 1)
    }
    set(state.sheets[index].params, path, mutVal)
  },

  foldersLoaded(state, folder) {
    state.folder = new FolderModel().setInfo(folder)
    state.foldersLoaded = true
  },

  updateCurrentRightClickMenu(state, item) {
    state.currentRightClickMenu = item
  },

  foldersUnloaded(state) {
    state.foldersLoaded = false
  },

  updateFolder(state, obj) {
    state.folder = state.folder.updateChild(obj)
  },

  updateImage(state, obj) {
    state.folder = state.folder.updateImage(obj)
  },

  deleteFolder(state, id) {
    state.folder = state.folder.deleteChild(id)
  },

  deleteImage(state, id) {
    state.folder = state.folder.deleteImage(id)
  },

  updateSheetName(state, { id, name }) {
    const index = state.sheets.findIndex(item => item.id === id)
    state.sheets[index].name = name
  },

  updateMenuItemParams(state, { id, menuId, folderId, path, value }) {
    const menus = state.info.menus
    const menu = menus.find(item => item.id === menuId)
    const folder = menu.folderById(menu.rootFolder, folderId)
    const item = folder.items.find(item => item.id === id)
    set(item.params, path, value)
  },

  removeOpenModal(state, key) {
    state.openModals = state.openModals.filter(modal => modal.key !== key)
  },

  updateSpecialTabs(state, specials) {
    state.specialTabs = specials.map((item, index) => {
      if (item && item.type === 'tab') return { index: index, tab: item }
    }).filter(Boolean)
  },

  changePageColor(state, { id, type, color }) {
    const colorObj = {}
    colorObj[id] = {}
    colorObj[id][type] = { color }
    state.pageColor = { ...state.pageColor, ...colorObj  }
  },

  changeBorderColor(state, value) {
    state.borderColor = value
  },

  changeBodyColor(state, value) {
    state.bodyColor = value
  },

  updatePageName(state, name) {
    state.pageName = name
  },

  deleteSheet(state, id) {
    deleteSheet(state, id)
  },

  deleteUser(state, id) {
    state.users = state.users.filter(user => user.id !== id.toString())
  },

  updateSheet(state, raw) {
    const sheet = state.sheets.find(item => item.id === raw.id)
    sheet.setInfo(raw)
  },

  usersLoaded(state, users) {
    state.users = users.data.map(user => (
      new UserModel().setInfo({ data: user })
    ))
  },

  messagesLoaded(state, messages) {
    state.messages = messages.data.map(data => (
      new MessageModel().setInfo({ data, included: messages.included })
    ))
  },

  setLoaded(state) {
    state.loaded = true
  },

  addSheet(state, params) {
    addSheet(state, params)
    if (state.currentItem.mark !== 'sheet') state.marks = { ...state.marks, sheet: state.marks.sheet + 1 }
  },

  addUser(state, user) {
    if (state.users.find(item => item.id === user.id)) return
    state.users = [...state.users, new UserModel().setInfo(user)]
  },

  addPage(state, page) {
    state.info = state.info.addPage(page)
  },

  addMenuFolder(state, { raw, user }) {
    if (state.info.master.id !== user.id) return

    const path = raw.data.attributes.path
    const menu = state.info.menus.find(menu => menu.id === raw.data.attributes.menuId.toString())
    let parentFolder
    let folder
    const newFolder = new MenuFolderItemModel().setInfo({ data: raw.data, changeAcl: false })

    path.forEach((id, index) => {
      if (path.length === index + 1) return

      parentFolder = (parentFolder || menu.rootFolder).children.find(item => item.id === id.toString())
      folder = parentFolder.children.find(item => item.id === path[index + 1]) || null
    })

    if (folder) {
      folder.setInfo({ data: raw.data, changeAcl: false })
    } else {
      (parentFolder || menu.rootFolder).children.push(newFolder)
    }
  },

  addMenuItem(state, { raw, user }) {
    const menuItem = pushMenuItem(state, { raw, user })
    if (!menuItem) return

    const menu = state.info.menus.find(item => item.id === menuItem.menuId)
    const mark = menu.params.mark
    if (!mark) return

    if (state.currentItem.mark !== mark) state.marks = { ...state.marks, [mark]: state.marks[mark] + 1 }
  },

  updateSheets(state, sheet) {
    const index = state.sheets.findIndex(item => item.id === sheet.data.id)
    state.sheets[index] = state.sheets[index].setInfo(sheet, false)
  },

  updateUser(state, user) {
    const index = state.users.findIndex(item => item.id === user.id)
    state.users[index] = state.users[index].setInfo(user)
  },

  updatePage(state, page) {
    state.info = state.info.updatePage(page)
  },

  updateFolderItem(state, raw) {
    const menus = state.info.menus
    const menuId = raw.data.attributes.menuId
    const menu = menus.find(item => item.id === menuId)
    const folder = menu.folderById(menu.rootFolder, raw.data.id)
    folder.setInfo({ data: raw.data, changeAcl: false })
  },

  updateMenuItem(state, raw) {
    const menus = state.info.menus
    const menuId = raw.data.attributes.menuId
    const folderId = raw.data.attributes.folderId
    const menu = menus.find(item => item.id === menuId)
    const folder = menu.folderById(menu.rootFolder, folderId)
    const item = folder.items.find(item => item.id === raw.data.id)
    item.setInfo({ data: raw.data, changeAcl: false })
  },

  deletePage(state, id) {
    state.info = state.info.deletePage(id)
    const maxIndex = state.info.pages.length - 1
    if (maxIndex > state.currentPage) state.currentPage = maxIndex
  },

  deleteMenuFolder(state, raw) {
    const menus = state.info.menus
    const menuId = raw.menuId
    const menu = menus.find(item => item.id === menuId.toString())
    menu.deleteChild(menu.rootFolder, raw.id.toString())
  },

  deleteMenuItem(state, raw) {
    const menus = state.info.menus
    const menuId = raw.menuId
    const menu = menus.find(item => item.id === menuId.toString())
    const folder = menu.folderById(menu.rootFolder, raw.folderId.toString())
    folder.deleteItem(raw.id)
  },

  accessSheet(state, { user, raw }) {
    let index = state.sheets.findIndex(item => item.id === raw.data.id)
    let sheet = state.sheets[index]

    if (sheet) {
      sheet.setInfo({
        data: raw.data,
        changeAcl: true,
        currentUserId: user.id,
        masterId: state.info.master.id,
      })
    } else {
      sheet = new SheetModel().setInfo({
        data: raw.data,
        changeAcl: true,
        currentUserId: user.id,
        masterId: state.info.master.id,
      })
    }

    if (sheet.acl.canRead) {
      if (index >= 0) state.sheets[index] = sheet
      else state.sheets = [...state.sheets, sheet]
    } else {
      if (index >= 0) deleteSheet(state, sheet.id)
    }
  },

  accessMenuItem(state, { user, raw }) {
    const rootFolder = new MenuFolderItemModel().setInfo({
      data: raw.data,
      changeAcl: true,
      currentUserId: user.id,
      masterId: state.info.master.id,
    })

    const menu = state.info.menus.find(menu => menu.id === rootFolder.menuId)
    menu.rootFolder = rootFolder
  },

  addMessage(state, message) {
    state.messages.push(new MessageModel().setInfo(message))
    if (state.currentItem.mark !== 'chat') state.marks = { ...state.marks, chat: state.marks.chat + 1 }
  },

  altIsPressed(state, value) {
    state.altPressed = value
  },
}
