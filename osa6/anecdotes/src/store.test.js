import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
    default: {
        getAll: vi.fn(),
        update: vi.fn()
    }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, /*usePendingIDs,*/ useActions } from './store'


beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], searchString: '', pendingIds: [] })
    vi.clearAllMocks()
})
describe('useActions', () => {

    it('initialize() loads all anecdotes from the database', async () => {
        const mockAnecdotes = [{ content: 'Test', id: '47145', votes: 1 }]
        anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

        const { result } = renderHook(() => useActions())
        await act(async () => {
            await result.current.initialize()
        })

        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current).toEqual(mockAnecdotes)
    })

    it('anecdotes received from the store are sorted by votes', async () => {
        const mockAnecdotes = [{ content: 'Test', id: '47145', votes: 0 }, { content: 'Test2', id: '47146', votes: 2 }, { content: 'Test3', id: '47147', votes: 1 }]
        anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

        const { result } = renderHook(() => useActions())
        await act(async () => {
            await result.current.initialize()
        })

        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current).toEqual( // toEqual() fails if the arrays are not in the same order
            [{ content: 'Test2', id: '47146', votes: 2 },
            { content: 'Test3', id: '47147', votes: 1 },
            { content: 'Test', id: '47145', votes: 0 }
            ])
    })

    it('React component receives a properly filtered list of anecdotes', async () => {
        const mockAnecdotes = [{ content: 'Random anecdote', id: '47145', votes: 0 }, { content: 'Mock anecdote', id: '47146', votes: 2 }, { content: 'Artificial anecdote', id: '47147', votes: 1 }]
        anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

        const { result } = renderHook(() => useActions())
        await act(async () => {
            await result.current.initialize()
            useAnecdoteStore.setState({ searchString: 'Ra' })
        })
        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current).toEqual([{ content: 'Random anecdote', id: '47145', votes: 0 }])

        await act(async () => {
            useAnecdoteStore.setState({ searchString: 'ck' })
        })
        expect(anecdotesResult.current).toEqual([{ content: 'Mock anecdote', id: '47146', votes: 2 }])

        await act(async () => {
            useAnecdoteStore.setState({ searchString: 'ti' })
        })
        expect(anecdotesResult.current).toEqual([{ content: 'Artificial anecdote', id: '47147', votes: 1 }])
    })

    it('Voting increases the number of votes for an anecdote', async () => {
        const mockAnecdotes = [{ content: 'Test anecdote', id: '47145', votes: 0 }]
        anecdoteService.getAll.mockResolvedValue(mockAnecdotes)
        anecdoteService.update.mockResolvedValue({ ...mockAnecdotes[0], votes: 1 })

        const { result } = renderHook(() => useActions())
        await act(async () => {
            await result.current.initialize()
            await result.current.addVote(mockAnecdotes[0].id)
        })
        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current).toEqual([{ content: 'Test anecdote', id: '47145', votes: 1 }])
        expect(anecdoteService.update).toHaveBeenCalledWith(mockAnecdotes[0].id, { ...mockAnecdotes[0], votes: 1 })
    })
})