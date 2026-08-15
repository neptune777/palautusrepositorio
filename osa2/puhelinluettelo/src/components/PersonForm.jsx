import Header from "./Header"
const PersonForm = ({ propsObject }) => {

    return (
        <form onSubmit={propsObject.addNewName_}>
            <Header level={2} title='add a new' />
            <div>
                <label htmlFor="name">name:{' '}</label>
                <input id="name" type="text" value={propsObject.newName_} onChange={propsObject.handleNewNameChange_} />
            </div>
            <div>
                <label htmlFor="number">number:{' '}</label>
                <input id="number" type="text" value={propsObject.newNumber_} onChange={propsObject.handleNewNumberChange_} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}
export default PersonForm