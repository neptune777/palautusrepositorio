
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const useAnecdoteStore = create((set) => ({
  searchString: '',
  anecdotes: [],
  actions: {
    addVote: id => set(state => ({
      anecdotes: state.anecdotes.map(anecdote => anecdote.id === id ? { ...anecdote, votes: anecdote.votes + 1 } : anecdote)
    })),
    addAnecdote: newAnecdote => set(state => ({
      anecdotes: [...state.anecdotes, asObject(newAnecdote)]
    })),
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
