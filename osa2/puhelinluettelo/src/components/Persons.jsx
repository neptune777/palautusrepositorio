import Person from "./Person";

const Persons = ({ newSearchWord, persons, deletePerson }) => {

    return (
        <ul className='person-list'>
            {newSearchWord.length === 0 ?
                persons.map(person => <Person key={person.id} dbKey={person.id} name={person.name} number={person.number} deletePerson={deletePerson} />)
                : persons.map(person => {
                    if (person.name.toLowerCase().includes(newSearchWord.toLowerCase())) {
                        return <Person key={person.id} dbKey={person.id} name={person.name} number={person.number} deletePerson={deletePerson} />
                    }
                })}
        </ul>
    )
}
export default Persons