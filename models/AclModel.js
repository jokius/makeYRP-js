export class AclModel {
  id = null
  masterId = null
  currentUserId = null
  writeAll = false
  readAll = false
  ownerId = null
  readIds = []
  writeIds = []

  setInfo({ data, currentUserId, masterId }) {
    if (!data) return this

    this.id = data.id
    this.currentUserId = currentUserId
    this.masterId = masterId
    this.writeAll = data.writeAll
    this.readAll = data.readAll
    this.ownerId = data.ownerId
    this.readIds = data.readIds
    this.writeIds = data.writeIds

    return this
  }

  isMaster() {
    return this.masterId === this.currentUserId
  }

  isOwner() {
    return this.ownerId === this.currentUserId
  }

  get canFull() {
    return this.isMaster() || this.isOwner()
  }

  get canWrite() {
    return this.isOwner() || this.writeAll || this.isMaster() || this.writeIds.includes(this.currentUserId)
  }

  get canRead() {
    return this.readAll || this.isMaster() || this.isOwner() || this.canWrite
      || this.readIds.includes(this.currentUserId)
  }
}
