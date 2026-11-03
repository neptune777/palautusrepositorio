import { useAnecdotes, useActions } from "./store"

const App = () => {

  const anecdotes = useAnecdotes()
  const { addVote, addAnecdote } = useActions()

  const addNewAnecdote = (e) => {
    e.preventDefault()
    const newAnecdote = e.target.fieldForNewAnecdote.value
    addAnecdote(newAnecdote)
    e.target.reset()
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => addVote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <h2>create new</h2>
      <form onSubmit={addNewAnecdote}>
        <div>
          <input data-testid="new" name="fieldForNewAnecdote" />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default App
