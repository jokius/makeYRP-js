export const addSystem = ({ axios, params }) => {
  const formData = new FormData()
  formData.append('name', params.name)
  formData.append('file', params.file)
  formData.append('data_file', params.dataFile)
  formData.append('private_data_file', params.privateDataFile)

  return axios
    .post('systems', formData)
}

export const loadSystems = (axios) =>
  axios
    .get('systems.json')
    .then(response => response.data)
