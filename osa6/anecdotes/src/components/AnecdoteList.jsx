import { useAnecdotes, useActions } from '../store'
import { useState } from 'react'

const AnecdoteList = () => {
    const [pendingIds, setPendingIds] = useState([]) // state for preventing missing of fast clicks

    const anecdotes = useAnecdotes().toSorted((anecdote1, anecdote2) => anecdote2.votes - anecdote1.votes)

    const { addVote } = useActions()

    const handleVote = async id => {
        setPendingIds(ids => [...ids, id])
        try {
            await addVote(id)
        } catch (error) {
            console.error('Voting failed:', error)
        } finally {
            setPendingIds(ids => ids.filter(pendingId => pendingId !== id)) // By removing the id from pendingIds the button can be used again
        }
    }

    return (
        <>
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