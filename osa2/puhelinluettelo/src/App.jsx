import { useState, useEffect } from 'react'

import Header from './components/Header'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personsService from './services/personsService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearchWord, setNewSearchWord] = useState('')
  const [notification, setNotification] = useState(null)
  const [style, setStyle] = useState({
    color: 'green',
    borderStyle: 'solid',
    backgroundColor: 'lightGray',
    padding: '10px',
    fontSize: '18px',
    width: '500px',
    marginBottom: '10px'
  })

  useEffect(() => {
    personsService
      .getAll()
      .then(response => setPersons(response))
      .catch(error => {
        console.log(`Could not fetch data from server. Error: ${error}`)
        setStyle({ ...style, color: 'red' })
        setNotification(`Could not fetch data from server.`)
        removeNotificationAfterAMoment();
      })
  }, [])


  const handleNewNameChange = (event) => setNewName(event.target.value)
  const handleNewNumberChange = (event) => setNewNumber(event.target.value)
  const handleNewSearchWordChange = (event) => setNewSearchWord(event.target.value)

  const personExists = (name) => persons.some(person => person.name === name)

  const removeNotificationAfterAMoment = () => {
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const addNewName = (event) => {
    event.preventDefault()

    if (personExists(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person_ = persons.find(person => person.name === newName)
        personsService
          .updatePerson({ name: newName, number: newNumber, id: person_.id }, person_.id)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))
            setStyle({ ...style, color: 'green' })
            setNotification(`${newName} was updated`)
            removeNotificationAfterAMoment();
          })
          .catch(error => {
            console.log(`Could not update person ${newName}. Error: ${error}`)
            setPersons(persons.filter(person => person.id !== person_.id))
            setStyle({ ...style, color: 'red' })
            setNotification(`Information of ${newName} was already deleted from server.`)
            removeNotificationAfterAMoment();
          })
      }
    }
    else {
      personsService
        .create({ name: newName, number: newNumber })
        .then(returnedNewPerson => {
          setPersons(persons.concat(returnedNewPerson))
          setStyle({ ...style, color: 'green' })
          setNotification(`Added ${newName}`)
          removeNotificationAfterAMoment();
        })
        .catch(error => {
          console.log(`Could not add ${newName}. Error: ${error}`)
          setStyle({ ...style, color: 'red' })
          setNotification(`Could not add ${newName}.`)
          removeNotificationAfterAMoment()
        })
    }
  }

  const deletePerson = (id) => {

    if (window.confirm(`Delete ${persons.find((person) => person.id === id).name}?`)) {
      personsService
        .deletePerson(id)
        .then(deletedPerson => {
          setPersons(persons.filter(person => person.id !== id))
          const deletedPerson_ = persons.find(person => person.id == id)
          if (deletedPerson_) {
            setStyle({ ...style, color: 'green' })
            setNotification(`${deletedPerson_.name} was deleted`)
          } else {
            setStyle({ ...style, color: 'red' })
            setNotification(`The person was probably deleted but could not find it from memory.`)
          }
          removeNotificationAfterAMoment();
        })
        .catch(error => {
          console.log('Could not delete the person with id', id, ', error', error)
        })
    }
  }

  const propsObjectForPersonForm = {
    addNewName_: addNewName,
    newName_: newName,
    handleNewNameChange_: handleNewNameChange,
    newNumber_: newNumber,
    handleNewNumberChange_: handleNewNumberChange
  }

  return (
    <div>

      <Header level={2} title='Phonebook' />
      {notification !== null && (
        <Notification message={notification} messageStyle={style} />
      )}

      <Filter newSearchWord={newSearchWord} handleNewSearchWordChange={handleNewSearchWordChange} filterText={'filter shown with:'} />

      <PersonForm propsObject={propsObjectForPersonForm} />

      <Header level={2} title='Numbers' />

      <Persons newSearchWord={newSearchWord} persons={persons} deletePerson={deletePerson} />

    </div>
  )
}
export default App