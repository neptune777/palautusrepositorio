import { useActions } from '../store'
const AnecdoteForm = () => {

    const { addAnecdote } = useActions()

    const addNewAnecdote = (e) => {
        e.preventDefault()
        const newAnecdote = e.target.fieldForNewAnecdote.value
        addAnecdote(newAnecdote)
        e.target.reset()
    }
    return (
        <>
            <h2>create new</h2>
            <form onSubmit={addNewAnecdote}>
                <div>
                    <input data-testid="new" name="fieldForNewAnecdote" />
                </div>
                <button>create</button>
            </form>
        </>
    )
}
export default AnecdoteForm