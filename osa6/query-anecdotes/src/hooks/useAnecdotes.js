import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { getAll, createAnecdote, updateAnecdote } from '../requests'
import useNotification from './useAnecdotesContextAPI'

export const useAnecdotes = () => {
    const { setNotificationProcess } = useNotification()
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
            setNotificationProcess(`A new anecdote '${newAnecdote.content}' added`)
        }
    })
    const votingAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: (newAnecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(['anecdotes'], anecdotes.map(anecdote => anecdote.id === newAnecdote.id ? newAnecdote : anecdote))
            setNotificationProcess(`You voted '${newAnecdote.content}'`)
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