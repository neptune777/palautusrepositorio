import { useActions } from '../store'
const AnecdoteForm = () => {

    const { addAnecdote } = useActions()

    const addNewAnecdote = async (e) => {
        e.preventDefault()
        const form = e.target
        const newAnecdote = form.fieldForNewAnecdote.value
        try {
            await addAnecdote(newAnecdote)
            form.reset()
        } catch (error) {
            console.log('Could not add new anecdote. Error: ', error)
        }
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