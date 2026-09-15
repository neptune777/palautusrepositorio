import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}
const getAll = () => {
  const request = axios.get(baseUrl, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return request.then(response => {
    console.log('data:', response.data)
    return response.data
  })
}

export default { getAll, setToken }