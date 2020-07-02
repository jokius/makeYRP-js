export const loadGame = ({ axios, id }) =>
  axios
    .get(`games/${id}/config`)
    .then(response => response.data)

export const updateGame = ({ axios, params }) =>
  axios
    .put(`games/${params.id}/config`, params)
