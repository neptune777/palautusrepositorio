
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const useAnecdoteStore = create((set, get) => ({
  searchString: '',
  anecdotes: [],
  actions: {
    addVote: async id => {
      const modifiableAnecdote = get().anecdotes.find(anecdote => anecdote.id === id)
      const modifiableAnecdoteFinal = { ...modifiableAnecdote, votes: modifiableAnecdote.votes + 1 }
      const modifiedAnecdote = await anecdoteService.update(id, modifiableAnecdoteFinal)
      set(state => ({
        anecdotes: state.anecdotes.map(anecdote => anecdote.id === id ? modifiedAnecdote : anecdote)
      }))
    },
    addAnecdote: async newAnecdote => {
      const newAnecdoteAsObject = asObject(newAnecdote)
      const sentAnecdote = await anecdoteService.create(newAnecdoteAsObject)
      set(state => ({
        anecdotes: [...state.anecdotes, sentAnecdote]
      }))
    },
    searchStringChange: newSearchString => set(() => ({ searchString: newSearchString })),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
  },
}))

export const useAnecdotes = () => {

  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const searchString = useAnecdoteStore(state => state.searchString)
  return anecdotes.filter(anecdote => anecdote.content.includes(searchString))
}
export const useActions = () => useAnecdoteStore((state) => state.actions)
