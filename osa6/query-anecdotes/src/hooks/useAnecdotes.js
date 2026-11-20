import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { getAll, createAnecdote } from '../requests'

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
    return {
        isPending,
        anecdotes: data,
        addAnecdote: (content) => newAnecdoteMutation.mutate({ content }),
        isError,
        error
    }
}