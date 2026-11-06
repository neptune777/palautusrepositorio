const baseUrl = 'http://localhost:3001/anecdotes'
const getAll = async () => {
    const response = await fetch(baseUrl)
    if (!response.ok) {
        throw new Error('Failed to fetch anecdotes')
    }
    return await response.json()
}

const create = async newAnecdote => {
    const options = {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(newAnecdote)
    }
    const sentAnecdote = await fetch(baseUrl, options)
    if (!sentAnecdote.ok) {
        throw new Error('Could not post new anecdote to server')
    }
    return await sentAnecdote.json()
}
export default { getAll, create }