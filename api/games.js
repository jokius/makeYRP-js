export const loadGames = ({ axios, params }) =>
  axios
    .get('games.json', { params })
    .then(response => response.data)

export const createGame = ({ axios, params }) =>
  axios
    .post('games', params)
    .then(response => response.data)

export const joinGame = ({ axios, id }) =>
  axios
    .post(`games/${id}/join`)
    .then(response => response.data)

export const switchStatus = ({ axios, id }) =>
  axios
    .put(`games/${id}/switch_status`)
