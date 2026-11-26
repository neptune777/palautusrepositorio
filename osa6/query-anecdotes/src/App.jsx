import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotes } from './hooks/useAnecdotes'

const App = () => {

  const { anecdotes, isPending, isError, voteAnecdote } = useAnecdotes()

  const handleVote = (anecdote) => {
    const votedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    voteAnecdote(votedAnecdote, anecdote.id)
  }
  if (isError) {
    return <div>Anecdote service not available due to problems in server</div>
  }
  if (isPending && !isError) {
    return <div>Fetching data from the server</div>
  }
  const normalRender = !isPending && !isError
  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      {normalRender &&
        <AnecdoteForm />
      }
      {normalRender && anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App