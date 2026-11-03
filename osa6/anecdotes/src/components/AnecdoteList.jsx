import { useAnecdotes, useActions } from '../store'

const AnecdoteList = () => {

    const anecdotes = useAnecdotes()
    const { addVote } = useActions()

    return (
        <>
            {anecdotes.map((anecdote) => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => addVote(anecdote.id)}>vote</button>
                    </div>
                </div>
            ))}
        </>
    )

}
export default AnecdoteList