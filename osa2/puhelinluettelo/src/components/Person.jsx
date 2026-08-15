const Person = ({ name, number, deletePerson, dbKey }) => {
    return (<li>{name} {number} <button onClick={() => deletePerson(dbKey)}>delete</button></li>);
}
export default Person