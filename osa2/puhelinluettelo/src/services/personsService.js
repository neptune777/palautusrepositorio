import axios from 'axios';
const baseUrl = '/api/persons/';

const getAll = () => {
    const requestPromise = axios.get(baseUrl);
    return requestPromise.then(axiosResponse => axiosResponse.data);
}
const create = (newPerson) => {
    const requestPromise = axios.post(baseUrl, newPerson);
    return requestPromise.then(axiosResponse => axiosResponse.data);
}
const deletePerson = (id) => {
    const deletePromise = axios.delete(`${baseUrl}${id}`);
    return deletePromise.then(axiosResponse => axiosResponse.data);
}
const updatePerson = (data, id) => {
    const updatePromise = axios.put(`${baseUrl}${id}`, data);
    return updatePromise.then(axiosResponse => axiosResponse.data);
}

export default { getAll, create, deletePerson, updatePerson };