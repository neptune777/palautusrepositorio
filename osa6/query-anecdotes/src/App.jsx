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
    return <Notification text={'anecdote service not available due to problems in server'} />
  }
  const normalRender = !isPending && !isError
  return (
    <div>
      <h3>Anecdote app</h3>
      {isPending && !isError && (<Notification text={'Fetching data from the server'} />)}
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