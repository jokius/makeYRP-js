import { ShortFolderModel } from '@/models/ShortFolderModel'
import { FolderImageModel } from '@/models/FolderImageModel'

export class FolderModel {
  id = null
  name = ''
  parentId = null
  children = []
  images = []

  setInfo({ data, included }) {
    this.id = data.id
    const attributes = data.attributes
    this.name = attributes.name
    this.parentId = attributes.parentId?.toString()
    this.children = data.relationships.children.data.map(child => {
      const obj = included.find(item => item.type === 'shortFolder' && item.id === child.id)
      return new ShortFolderModel().setInfo(obj)
    })

    this.images = data.relationships.images.data.map(image => {
      const obj = included.find(item => item.type === 'folderImage' && item.id === image.id)
      return new FolderImageModel().setInfo(obj)
    })

    return this
  }

  updateChild(obj) {
    const child = this.children.find(item => item.id === obj.id)
    child.name = obj.name
    return this
  }

  deleteChild(id) {
    this.children = this.children.filter(child => child.id !== id)
    return this
  }

  updateImage(obj) {
    const image = this.images.find(item => item.id === obj.id)
    image.name = obj.name
    return this
  }

  deleteImage(id) {
    this.images = this.images.filter(image => image.id !== id)
    return this
  }
}
