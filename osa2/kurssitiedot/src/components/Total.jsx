const Total = ({ parts }) => {

    const myCallBack = (acc, curr) => acc + curr.exercises
    const total = parts.reduce(myCallBack, 0);

    return (
        <>
            <p><b>Total of {total} exercises</b></p>
        </>
    )
}
export default Total