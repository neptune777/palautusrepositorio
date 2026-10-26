import axios from 'axios'
const baseUrl = '/api/blogs/'
let token = null

const setToken = newToken => {
  token = newToken !== null ? `Bearer ${newToken}` : null
}
const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}
const create = async newObject => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const modify = async newObject => {
  const response = await axios.put(`${baseUrl}${newObject.id}`, newObject)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const response = await axios.delete(`${baseUrl}${id}`, config)
  return response
}

export default { getAll, setToken, create, modify, remove }