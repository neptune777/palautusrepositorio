import { useState } from 'react'
import Button from './Button'
import Header from './Header'
import Display from './Statistics'
import Statistics from './Statistics'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const sumOfGoodNeutralAndBad = good + neutral + bad;
  const avg = sumOfGoodNeutralAndBad === 0 ? 0 : (good - bad) / sumOfGoodNeutralAndBad;
  const average = !isNaN(avg) ? avg.toFixed(1) : 0;
  const pos = sumOfGoodNeutralAndBad === 0 ? 0 : (good / sumOfGoodNeutralAndBad) * 100;
  const positives = !isNaN(pos) ? pos.toFixed(1) : 0;
  let arrayOfFeatures = [
    { text: 'Good', value: good },
    { text: 'Neutral', value: neutral },
    { text: 'Bad', value: bad },
    { text: 'All', value: good + neutral + bad },
    { text: 'Average', value: average },
    { text: 'Positive', value: positives + '%' }
  ];
  return (
    <div>
      <Header title="Give feedback" />
      <Button onClick={() => setGood(good + 1)} text="Good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button onClick={() => setBad(bad + 1)} text="Bad" />
      <Header title="Statistics" />
      <Statistics
        arrayOfFeatures={arrayOfFeatures}
      />
    </div>
  )
}

export default App