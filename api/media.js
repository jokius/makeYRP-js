import FileDownload from 'js-file-download'

export const downloadList = (axios, keys) =>
  axios
    .post('medias/download', { keys }, { responseType: 'blob' })
    .then(response => FileDownload(response.data, 'media.zip'))
