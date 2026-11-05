import { useActions } from '../store'
const Filter = () => {
    const { searchStringChange } = useActions()

  const handleChange = (event) => {
    // the value of the input field is in event.target.value
    console.log('event.target.value',event.target.value)
    searchStringChange(event.target.value)
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} data-testid="filter"/>
    </div>
  )
}

export default Filter