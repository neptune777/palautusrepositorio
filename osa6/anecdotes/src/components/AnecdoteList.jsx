import { useAnecdotes, useActions } from '../store'
import { useActionsOfNotification, useNotification } from '../notification'
import { useState } from 'react'
import Notification from './Notification'

const AnecdoteList = () => {
    const [pendingIds, setPendingIds] = useState([]) // state for preventing missing of fast clicks

    const anecdotes = useAnecdotes().toSorted((anecdote1, anecdote2) => anecdote2.votes - anecdote1.votes)
    const { setNotification } = useActionsOfNotification()
    const notification = useNotification()

    const { addVote } = useActions()

    const handleVote = async id => {
        setPendingIds(ids => [...ids, id])
        const anecdoteContent = anecdotes.find(anecdote => anecdote.id === id).content
        if (anecdoteContent) {
            try {
                await addVote(id)
                setNotification({ content: `You voted '${anecdoteContent}'`, type: 'success' })

            } catch (error) {
                console.error('Voting failed:', error)
            } finally {
                setPendingIds(ids => ids.filter(pendingId => pendingId !== id)) // By removing the id from pendingIds the button can be used again
            }
        } else {
            throw new Error('Could not find the content of the anecdote.')
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
                    </div>
                </div>
            ))}
        </>
    )

}
export default AnecdoteList