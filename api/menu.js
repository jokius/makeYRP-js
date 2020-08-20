export const loadMenuItems = ({ axios, id }) =>
  axios
    .get(`menu/${id}/items.json`)
    .then(response => response.data)
