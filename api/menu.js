export const loadMenuFolders = ({ axios, id }) =>
  axios
    .get(`menu/${id}/folders.json`)
    .then(response => response.data)
