export const loadGame = ({ axios, id }) =>
  axios
    .get(`games/${id}.json`)
    .then(response => response.data)

export const loadSheets = ({ axios, id }) =>
  axios
    .get(`games/${id}/sheets.json`)
    .then(response => response.data)

export const loadUsers = ({ axios, id }) =>
  axios
    .get(`games/${id}/users.json`)
    .then(response => response.data)

export const loadMessages = ({ axios, id }) =>
  axios
    .get(`games/${id}/messages.json`)
    .then(response => response.data)

export const loadItems = ({ axios, id }) =>
  axios
    .get(`games/${id}/items.json`)
    .then(response => response.data)
