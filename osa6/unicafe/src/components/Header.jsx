const Header = ({ title, level }) => {
    if (level === 1) {
        return (
            <h1>{title}</h1>
        )
    } else if (level === 2) {
        return (
            <h2>{title}</h2>
        )
    } if (level === 3) {
        return (
            <h3>{title}</h3>
        )
    }
}

export default Header