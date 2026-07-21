import StatisticLine from './StatisticLine '
const Statistics = ({ arrayOfFeatures }) => {

    const featureValueNonZero = (obj) => parseFloat(obj.value) !== 0;

    return (
        <>
            <table>
                <tbody>
                    {arrayOfFeatures.some(featureValueNonZero) ? (arrayOfFeatures.map((feature, index) => (
                        <StatisticLine key={index} text={feature.text} value={feature.value} />
                    ))) : <tr><td>No feedback given.</td></tr>}
                </tbody>
            </table>
        </>
    )
}
export default Statistics