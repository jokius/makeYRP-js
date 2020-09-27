export const updateUser = ({ axios, params }) => {
  const formData = new FormData()
  formData.append('nickname', params.nickname)
  formData.append('color', params.color)
  formData.append('avatar', params.avatar)

  return axios
    .put('user.json', formData)
    .then(response => response.data)
}
