export const loadGames = (axios) =>
  axios
    .get(`admin/games.json`)
    .then(response => response.data)

export const deleteGame = ({ axios, id }) =>
  axios
    .delete(`admin/games/${id}`)
