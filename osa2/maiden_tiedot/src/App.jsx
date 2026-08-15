import './App.css'
import { useState, useEffect, useRef } from 'react'
import countriesService from './services/countriesService'
import Filter from './components/Filter'
import Countries from './components/Countries'

function App() {
  const [newSearchWord, setNewSearchWord] = useState('')
  const [countries, setCountries] = useState([])
  const [showableCountries, setShowableCountries] = useState([])
  const latestRequestId = useRef(0)  // A counter to prevent race conditions of promises

  const getAndSetDataOfSingleCountry = (name) => {
    const requestId = ++latestRequestId.current
    countriesService
      .getByName(name)
      .then(response => {
        const capital = response.capital?.[0]
        if (capital !== undefined) {
          return countriesService
            .getWeatherConditionsOfCapital(capital)
            .then(responseFromWeatherService => {
              // A newer search/request has occurred, so ignore this result.
              if (requestId !== latestRequestId.current) {
                return
              }
              const iconUrl = `https://openweathermap.org/img/wn/${responseFromWeatherService.weather[0].icon.trim()}@2x.png`
              const ourSingleShowable = { name: response.name.common, capital: capital, iconUrl: iconUrl, main: responseFromWeatherService.main, weather: responseFromWeatherService.weather, wind: responseFromWeatherService.wind, area: response.area, languages: response.languages, flag: response.flags.png }
              const newShowables = new Array()
              newShowables.push(ourSingleShowable)
              setShowableCountries(newShowables)
            })
            .catch(error => {
              // A newer search/request has occurred, so ignore this result.
              if (requestId !== latestRequestId.current) {
                return
              }
              console.log('Could not get weather data for', name, error)
              // In this case, we can still update the country data
              const ourSingleShowable = { name: response.name.common, capital: capital, iconUrl: undefined, main: undefined, weather: undefined, wind: undefined, area: response.area, languages: response.languages, flag: response.flags.png }
              const newShowables = new Array()
              newShowables.push(ourSingleShowable)
              setShowableCountries(newShowables)
            })
        } else {
          if (requestId !== latestRequestId.current) {
            return
          }
          const ourSingleShowable = { name: response.name.common, capital: capital, iconUrl: undefined, main: undefined, weather: undefined, wind: undefined, area: response.area, languages: response.languages, flag: response.flags.png }
          const newShowables = new Array()
          newShowables.push(ourSingleShowable)
          setShowableCountries(newShowables)
        }
      })
      .catch(error => {
        if (requestId === latestRequestId.current) { // Error logging only for the newest request
          console.error(
            'Could not get country data for',
            name,
            error
          )
        }
      })
  }
  const handleNewSearchWordChange = (event) => {
    latestRequestId.current += 1
    const newSWord = event.target.value.toLowerCase()
    setNewSearchWord(newSWord)
    if (newSWord.length !== 0) {
      const showables = countries.filter(countryString => {
        if (countryString.toLowerCase().includes(newSWord)) {
          return countryString
        }
      })
      if (showables.length === 1) {
        setShowableCountries([])
        getAndSetDataOfSingleCountry(showables[0])
      }
      else {
        setShowableCountries(showables)
      }

    }
  }
  useEffect(() => {
    countriesService
      .getNamesOfAll()
      .then(response => {
        setCountries(response)
      })
      .catch(error => {
        console.log('An error occured when trying to fetch all data. Error:', error)
      })
  }, [])
  const createObjectOfCountries = (showables) => {
    if (countries.length > 0) {
      const showablesCount = showables.length
      if (showablesCount > 0) {
        let ourReturnable = {}
        ourReturnable.countries = []
        if (showablesCount > 1) {
          ourReturnable.showAllData = false
          for (let name_ of showables) {
            const countryObject = { name: name_ }
            ourReturnable.countries.push(countryObject)
          }
        }
        else if (showablesCount === 1) {
          ourReturnable.showAllData = true
          ourReturnable.countries.push(showables[0])
        }
        return ourReturnable;
      }
    }
  }
  const showACertainCountry = (countryName) => {
    getAndSetDataOfSingleCountry(countryName)
  }
  const props = createObjectOfCountries(showableCountries)

  return (
    <main className="countries-page">
      <Filter newSearchWord={newSearchWord} handleNewSearchWordChange={handleNewSearchWordChange} filterText={'find countries'} />
      {newSearchWord && props && (<Countries objectOfCountries={props} clickHandler={showACertainCountry} />)}
    </main>
  )
}
export default App
