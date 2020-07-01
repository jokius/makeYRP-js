export const loadTokens = ({ axios, page_id }) =>
  axios
    .get(`pages/${page_id}/tokens.json`)
    .then(response => response.data)

export const loadImages = ({ axios, page_id }) =>
  axios
    .get(`pages/${page_id}/images.json`)
    .then(response => response.data)

export const loadGraphics = ({ axios, page_id }) =>
  axios
    .get(`pages/${page_id}/graphics.json`)
    .then(response => response.data)
