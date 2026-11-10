import { useAnecdotes, usePendingIDs, useActions } from '../store'
import { useActionsOfNotification, useNotification } from '../notification'
import Notification from './Notification'

const AnecdoteList = () => {

    const anecdotes = useAnecdotes().toSorted((anecdote1, anecdote2) => anecdote2.votes - anecdote1.votes)
    const pendingIds = usePendingIDs() // state for preventing missing of fast clicks   
    const { setNotification } = useActionsOfNotification()
    const notification = useNotification()

    const { addVote, deleteAnecdote, addPendingId, removePendingId } = useActions()

    const handleVote = async id => {
        addPendingId(id)
        try {
            const anecdote = anecdotes.find(anecdote => anecdote.id === id)
            if (!anecdote) {
                throw new Error('Could not find the anecdote.')
            }
            await addVote(id)
            setNotification({ content: `you voted '${anecdote.content}'`, type: 'success' })

        } catch (error) {
            console.error('Voting failed:', error)
        } finally {
            removePendingId(id) // By removing the id from pendingIds the button can be used again
        }
    }
    const handleDelete = async id => {
        addPendingId(id)
        const deletable = anecdotes.find(anecdote => anecdote.id === id)
        try {
            await deleteAnecdote(id)
            setNotification({ content: `Anecdote '${deletable.content}' deleted`, type: 'success' })
        } catch (error) {
            console.log('Deleting of anecdote failed.', error)
        } finally {
            removePendingId(id) // By removing the id from pendingIds the button can be used again 
        }
    }

    return (
        <>
            {notification !== null && (
                <Notification />
            )}
            {anecdotes.map((anecdote) => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote.id)} disabled={pendingIds.includes(anecdote.id)}>vote</button>
                        {anecdote.votes === 0 && (
                            <button onClick={() => handleDelete(anecdote.id)} disabled={pendingIds.includes(anecdote.id)}>delete</button>
                        )}
                    </div>
                </div>
            ))}
        </>
    )

}
export default AnecdoteList