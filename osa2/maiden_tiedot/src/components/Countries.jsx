import Country from './Country'

const Countries = ({ objectOfCountries, clickHandler }) => {

    const numberOfCountries = objectOfCountries.countries.length

    if (numberOfCountries > 10) {
        return 'Too many matches, try another filter.'
    }
    else if (numberOfCountries > 1 && numberOfCountries < 11) {
        return (
            <ul className="countries-list">
                {objectOfCountries.countries.map(country =>
                (
                    <li key={country.name} >
                        <Country objectOfFeatures={country} showAllData={false} />
                        <button onClick={() => clickHandler(country.name)}>Show</button>
                    </li>
                ))}
            </ul>
        )
    }
    else if (numberOfCountries === 1) {
        return (
            <>
                <Country objectOfFeatures={objectOfCountries.countries[0]} showAllData={true} />
            </>
        )
    } else {
        console.log(`In the component 'Countries': Nothing will be rendered because 'numberOfCountries' did not match any of the conditions.`)
    }
}
export default Countries