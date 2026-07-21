import { useState } from 'react'
import Button from './Button.jsx'
import Header from './Header.jsx';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ];

  const [selected, setSelected] = useState(0);

  const anecdotesLen = anecdotes.length;

  if (anecdotesLen <= 0) {
    console.log("Warning: The anecdotes array is probably empty.");
    return;
  }

  let nextAnecdote = selected;

  let initialVotes = new Array(anecdotesLen).fill(0);

  const [votes, setVotes] = useState(initialVotes);

  const [mostVoted, setMostVoted] = useState({ anecdote: anecdotes[0], votes: 0 });

  const findAndSetMostVoted = (mappedVotes) => {
    let valueOfMostVoted = -1;
    let anecdoteWithMostVotes = "-1";
    for (let i = 0; i < mappedVotes.length; i++) {
      let votesInThisElement = mappedVotes[i];
      if (votesInThisElement > valueOfMostVoted) {
        valueOfMostVoted = votesInThisElement;
        anecdoteWithMostVotes = anecdotes[i];
      }
    }
    setMostVoted({ anecdote: anecdoteWithMostVotes, votes: valueOfMostVoted });
  }

  const vote = (index) => {

    const mappedVotes = votes.map((value, key) => {

      if (key === index) {
        let temporalValue = value + 1;
        return temporalValue;
      } else {
        return value;
      }

    });
    setVotes(mappedVotes);
    findAndSetMostVoted(mappedVotes);
  }
  const setNextAnecdote = () => {

    anecdotesLen > 0 ? nextAnecdote = Math.floor(Math.random() * anecdotesLen) : -1;

    if (nextAnecdote == selected) {
      let counter = 0;
      while (nextAnecdote == selected && counter < 10) {
        anecdotesLen > 0 ? nextAnecdote = Math.floor(Math.random() * anecdotesLen) : -1;
        counter++;
      }
    }
    if (nextAnecdote !== (-1)) {
      setSelected(nextAnecdote);
    } else {
      console.log("setNextAnecdote(), could not generate index for the next anecdote.");
      return;
    }
  }
  const nextAnecdoteOk = nextAnecdote !== (-1);

  const mostVotedOk = mostVoted.anecdote !== "-1" && mostVoted.votes !== (-1);

  if (!mostVotedOk) {

    if (mostVoted.anecdote === "-1") {
      console.log("mostVoted.anecdote === '-1'");
    }
    if (mostVoted.votes === (-1)) {
      console.log("mostVoted.votes === (-1)");
    }

  }

  return (
    <div>
      <Header title={"Anecdote of the day"} level={2} />
      {nextAnecdoteOk ? <div>{anecdotes[nextAnecdote]}</div> : <div> No anecdotes added. </div>}
      {nextAnecdoteOk ? <div>has {votes[nextAnecdote]} votes</div> : <div> No anecdotes, no votes. </div>}
      <Button onClick={() => vote(nextAnecdote)} text={"Vote"} />
      <Button onClick={setNextAnecdote} text={"Next anecdote"} />
      <Header title={"Anecdote with most votes"} level={2} />
      {mostVotedOk ? <div>{mostVoted.anecdote}</div> : <div>Could not find most voted anecdote</div>}
      {mostVotedOk ? <div>has {mostVoted.votes} votes</div> : <div>No most voted anecdote, no number of votes</div>}
    </div>
  )
}

export default App