import { useQuery } from '@tanstack/react-query'
import { getAll } from '../requests'

export const useAnecdotes = () => {

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAll
    })

    return {
        isPending,
        anecdotes: data,
        isError,
        error
    }
}