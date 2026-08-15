import Header from './Header'
const Country = ({ objectOfFeatures, showAllData }) => {

    if (showAllData) {

        return (
            <>
                <Header title={objectOfFeatures.name} level={1} />
                <div>
                    {objectOfFeatures.capital ? (
                        <>
                            <p>Capital {objectOfFeatures.capital}</p>
                        </>
                    ) : (<p>Capital not found</p>)
                    }
                    <p>Area {objectOfFeatures.area}</p>
                </div>
                <Header title='Languages' level={2} />
                <ul>

                    {   /* If objectOfFeatures.languages is null or undefined, use { }.
                        Mapping by using Object.entries({ }) or Object.keys({ }) does not return an error.
                        */
                        Object.entries(objectOfFeatures.languages ?? {}).map(language => {
                            return <li key={`${objectOfFeatures.name} ${language[1]}`}>{language[1]}</li>
                        })}
                </ul>
                <img src={objectOfFeatures.flag} alt="A national flag" />


                {objectOfFeatures.main ? (
                    <>
                        <Header title={`Weather in ${objectOfFeatures.capital}`} level={2} />
                        <div>
                            <p>Temperature {(objectOfFeatures.main.temp - 273.15).toFixed(2)} Celsius</p>
                        </div>
                        <img
                            src={objectOfFeatures.iconUrl}
                            alt={objectOfFeatures.weather[0].description}
                        />
                        <div>
                            <p>Wind {objectOfFeatures.wind.speed} m/s</p>
                        </div>
                    </>
                )

                    : (<Header title={`Weather unavailable because no capital was found.`} level={2} />)
                }
            </>
        )
    } else {
        return objectOfFeatures.name
    }

}
export default Country