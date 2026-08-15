const Filter = ({ newSearchWord, handleNewSearchWordChange, filterText, responseText }) => {
    return (
        <div>
            <label htmlFor="filter">{filterText}{' '}</label>
            <input id="filter" type="text" value={newSearchWord} onChange={handleNewSearchWordChange} />
            {responseText !== undefined && <p>{responseText}</p>}
        </div>
    )
}
export default Filter