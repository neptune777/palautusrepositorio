import Part from './Part'
const Content = ({ parts }) => <> <ul className="person-list"> {parts.map((part) => <Part key={part.id} partName={part.name} exercises={part.exercises} />)} </ul></>
export default Content