import Content from './Content'
import Total from "./Total"
import Header from "./Header"
const Course = ({ course }) => {

    return (
        <>
            <Header headerLevel={3} headerName={course.name} />
            <Content
                parts={course.parts} />
            <Total parts={course.parts} />
        </>
    )

}
export default Course