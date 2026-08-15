import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'

const getNamesOfAll = () => {
    const requestPromise = axios.get(`${baseUrl}${'all'}`)
    return requestPromise.then(response => response.data.map(countryObject => countryObject.name.common))
}
const getByName = (name) => {
    const requestPromise = axios.get(`${baseUrl}/name/${name}`)
    return requestPromise.then(response => {
        return response.data
    })
}
const getWeatherConditionsOfCapital = (name) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=0fc2899c6548dc90a7f5e60c2d518807`
    const requestPromise = axios.get(weatherUrl)
    return requestPromise.then(response => response.data)
}
export default { getNamesOfAll, getByName, getWeatherConditionsOfCapital }