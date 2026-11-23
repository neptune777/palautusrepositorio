import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { getAll, createAnecdote, updateAnecdote } from '../requests'

export const useAnecdotes = () => {
    const queryClient = useQueryClient()
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAll
    })
    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (newAnecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
        }
    })
    const votingAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: (newAnecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(['anecdotes'], anecdotes.map(anecdote => anecdote.id === newAnecdote.id ? newAnecdote : anecdote))
        }
    })
    return {
        isPending,
        anecdotes: data,
        addAnecdote: (content) => newAnecdoteMutation.mutate({ content }),
        voteAnecdote: (anecdote, id) => votingAnecdoteMutation.mutate({ anecdote, id }),
        isError,
        error
    }
}