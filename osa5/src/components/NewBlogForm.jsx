import { useState } from 'react'
import { Stack, TextField, Button } from '@mui/material'
const NewBlogForm = ({ sendNewBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handlerForBlogSend = async event => {
    event.preventDefault()
    await sendNewBlog({ title, author, url })
  }

  return (
    <div className="newBlog">
      <h2>create new</h2>
      <form onSubmit={event => handlerForBlogSend(event)}>
        <Stack spacing={2}>
          <TextField id="field-1" label="title" multiline sx={{ width: 300 }} size='small' value={title} onChange={({ target }) => setTitle(target.value)}/>
          <TextField id="field-2" label="author" multiline sx={{ width: 300 }} size='small' value={author} onChange={({ target }) => setAuthor(target.value)}/>
          <TextField id="field-3" label="url" multiline sx={{ width: 300 }} size='small' value={url} onChange={({ target }) => setUrl(target.value)}/>
        </Stack>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            create
        </Button>
      </form>
    </div>
  )
}
export default NewBlogForm