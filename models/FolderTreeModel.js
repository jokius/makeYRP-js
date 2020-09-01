import { FolderImageModel } from '@/models/FolderImageModel'

export class FolderTreeModel {
  id = null
  name = ''
  parentId = null
  children = []
  images = []

  setInfo({ data }) {
    this.id = data.id
    const attributes = data.attributes
    this.name = attributes.name
    this.parentId = attributes.parentId?.toString()
    this.children = attributes.children.map(child => new FolderTreeModel().setInfo(child))
    this.images = attributes.images.map(image => new FolderImageModel().setInfo(image.data))

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
