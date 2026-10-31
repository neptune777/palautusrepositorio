import { useValues } from '../../store'
import Header from './Header'
const Statistics = () => {
  const customRounding = (value) => {
    if (!isNaN(value)) {
      const number = Number(value)
      return number === 0 ? 0 : parseFloat(number.toFixed(2)).toString()
    }
    return 0
  }
  const { good, neutral, bad } = useValues()
  const all = good + neutral + bad
  const avg = all === 0 ? 0 : (good - bad) / all;
  const average = customRounding(!isNaN(avg) ? avg : 0);
  const pos = all === 0 ? 0 : (good / all) * 100;
  const positive = customRounding(!isNaN(pos) ? pos : 0);

  return (
    <div>
      <Header title='statistics' level={2} />
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>neutral</td><td>{neutral}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
          <tr><td>all</td><td>{all}</td></tr>
          <tr><td>average</td><td>{average}</td></tr>
          <tr><td>positive</td><td>{`${positive} %`}</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
