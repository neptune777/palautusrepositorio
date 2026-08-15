const Header = ({ headerName, headerLevel }) => {
    if (headerLevel === 1) {
        return (<h1>{headerName}</h1>)
    } else if (headerLevel === 2) {
        return (<h2>{headerName}</h2>)
    } else if (headerLevel === 3) {
        return (<h3>{headerName}</h3>)
    } else if (headerLevel === 4) {
        return (<h4>{headerName}</h4>)
    } else if (headerLevel === 5) {
        return (<h5>{headerName}</h5>)
    } else if (headerLevel === 6) {
        return (<h6>{headerName}</h6>)
    }
}
export default Header