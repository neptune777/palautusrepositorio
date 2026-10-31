import { useStateControls } from '../../store'
import Header from './Header'
const Buttons = () => {
  const { incrementForGood, incrementForNeutral, incrementForBad } = useStateControls()
  return (
    <div>
      <Header title='give feedback' level={2} />
      <button onClick={incrementForGood}>good</button>
      <button onClick={incrementForNeutral}>neutral</button>
      <button onClick={incrementForBad}>bad</button>
    </div>
  )
}

export default Buttons
