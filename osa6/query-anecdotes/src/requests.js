const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await fetch(baseUrl)
    if (!response.ok) {
        throw new Error('Could not fetch anecdotes from the server')
    }
    return response.json()
}
const createAnecdote = async (anecdote) => {
    const options = {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(anecdote)
    }
    const response = await fetch(baseUrl, options)
    if (!response.ok) {
        throw new Error('Could not send new anecdote to server')
    }
    return response.json()
}
const updateAnecdote = async ({ anecdote, id }) => {
    const options = {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(anecdote)
    }
    const response = await fetch(`${baseUrl}/${id}`, options)
    if (!response.ok) {
        throw new Error('Could not update anecdote in the server')
    }
    return response.json()
}
export { getAll, createAnecdote, updateAnecdote }