import { useActions } from '../store'
import { useActionsOfNotification } from '../notification'
const AnecdoteForm = () => {

    const { addAnecdote } = useActions()
    const { setNotification } = useActionsOfNotification()

    const addNewAnecdote = async (e) => {
        e.preventDefault()
        const form = e.target
        const newAnecdote = form.anecdote.value
        try {
            await addAnecdote(newAnecdote)
            setNotification({ content: `New anecdote '${newAnecdote}' added.`, type: 'success' })
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
                    <input data-testid="new" name="anecdote" />
                </div>
                <button>create</button>
            </form>
        </>
    )
}
export default AnecdoteForm