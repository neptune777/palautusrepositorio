import { useParams } from 'react-router-dom'
import { Stack, TextField, Button, List, ListItem, ListItemText, Grid } from '@mui/material'
const Blog = ({ user, blog, modifyBlog, deleteBlog }) => {

  const id = useParams().id
  console.log('Blog:',blog)
  if(!blog){
    return null
  }

  const deleteBlogFinal = async id => {
    await deleteBlog(id)
  }

  const modifyBlogFinal = async (id) => {
    await modifyBlog(id)
  }

  const showDeleteButton = Boolean(user && blog.user?.username === user.username)

  const contentByGrid = () => {
    const conditionalWidthForButtonRow = showDeleteButton ?  260 : 170

    { showDeleteButton ? { width: 100 }:{ width:50 } }
    return <>
      <Grid spacing={2}>
        <List>
          <ListItem  sx={{ width: 300, height: 40 }} size='small'>
            <ListItemText primary={blog.title} slotProps={{
              primary: {
                sx: {
                  fontWeight: 'bold',
                  fontSize: 20
                }
              }
            }}/>
          </ListItem>
          <ListItem  sx={{ width: 300, height: 40 }} size='small'>
            <ListItemText primary={`by ${blog.author}`}/>
          </ListItem>
          <ListItem  sx={{ width: 300, height: 50 }} size='small' component="a" href={blog.url} primary={blog.url}>
            <ListItemText primary={blog.url} />
          </ListItem>
          <ListItem  sx={{ width: 300, height: 40 }} size='small'>
            <ListItemText primary={`Added by ${blog.user.name ?? blog.user.username}`}/>
          </ListItem>
          <ListItem  sx={{ width: conditionalWidthForButtonRow, height: 40, marginTop:1 }} size='small'>
            <ListItemText primary={`${blog.likes} likes`} sx={{ width:100 }} data-testid='test-id-for-playwright'/>
            { user && (
              <Button type="submit" variant="outlined" style={{ width: 100, color: '#1313f5', borderColor: '#1313f5' }} onClick={() => modifyBlogFinal(id)}>
            like
              </Button>
            )
            }
            { showDeleteButton && (
              <Button type="submit" variant="outlined" style={{ width:150, marginLeft: 10, color: '#f51323', borderColor: '#f51323' }} onClick={() => deleteBlogFinal(id)}>
            remove
              </Button>
            )
            }
          </ListItem>
        </List>
      </Grid>
    </>
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle}>
      {contentByGrid()}
    </div >
  )
}
export default Blog