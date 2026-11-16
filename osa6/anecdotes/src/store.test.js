import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
    default: {
        getAll: vi.fn(),
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
})