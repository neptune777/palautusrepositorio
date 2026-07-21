const Header = ({ title, level }) => {
    if (level === 1) {
        return (
            <h1>{title}</h1>
        )
    } else if (level === 2) {
        return (
            <h2>{title}</h2>
        )
    }
    else if (level === 3) {
        return (
            <h3>{title}</h3>
        )
    }
    else if (level === 4) {
        return (
            <h4>{title}</h4>
        )
    }
    else if (level === 5) {
        return (
            <h5>{title}</h5>
        )
    } else if (level === 6) {
        return (
            <h6>{title}</h6>
        )
    }
}

export default Header