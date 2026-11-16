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
})