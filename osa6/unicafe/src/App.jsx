import Buttons from './components/Buttons'
import Statistics from './components/Statistics'
import Header from './components/Header'

const App = () => {
  return (
    <>
      <Header title='Unicafe' level={1} />
      <Buttons />
      <Statistics />
    </>
  )
}

export default App
