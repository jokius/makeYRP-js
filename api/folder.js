import links from '../lib/links'

export const createFolder = ({ axios, params }) =>
  axios
    .post(links.base.rootFolder, params)
    .then(response => response.data)

export const loadFolder = ({ axios, id }) =>
  axios
    .get(id ? links.dynamic(links.base.folder, { id }) : links.base.rootFolder)
    .then(response => response.data)

export const updateFolder = ({ axios, params }) =>
  axios
    .put(links.dynamic(links.base.folder, params), { ...params })
    .then(response => response.data)

export const updateImage = ({ axios, params }) =>
  axios
    .put(links.dynamic(links.base.folderImage, { id: params.id, folder_id: 0 }), { ...params })
    .then(response => response.data)

export const deleteFolder = ({ axios, id }) =>
  axios
    .delete(links.dynamic(links.base.folder, { id }))

export const deleteImage = ({ axios, id }) =>
  axios
    .delete(links.dynamic(links.base.folderImage, { id, folder_id: 0 }))

export const loadTree = (axios) =>
  axios
    .get(links.base.folderTree)
    .then(response => response.data)
