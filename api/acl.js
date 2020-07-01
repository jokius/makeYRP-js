export const AclUsers = ({ axios, params }) =>
  axios
    .get('acl.json', { params })
    .then(response => response.data)
