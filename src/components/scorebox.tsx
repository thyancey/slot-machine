import styled from 'styled-components';
import { AppContext } from '../store/appcontext';
import { useContext, useEffect, useState } from 'react';

const ScScorebox = styled.div`
  border: var(--border-width-small) solid var(--color-black);
  border-radius: 0.5rem;
  padding: 0.25rem 0.25rem 0.5rem 0.25rem;
  background-color: var(--color-black);
  text-align: right;
  width:100%;
  height:100%;
  transition: color .25s ease-in-out, font-size .25s ease-in-out;
  font-size: 3rem;

  &.highlighted{
    color: var(--color-pink);
    font-size: 4rem;
    transition: color .15s ease-out, font-size .15s ease-out;
  }

  p {
    margin: 0;
    padding: 0;
    line-height: 2rem;
  }
`;

function ScoreBox() {
  const { score } = useContext(AppContext);
  const [ highlighted, setHighlighted] = useState(false);
  
  useEffect(() => {
    setHighlighted(true);
    setTimeout(() => {
      setHighlighted(false);
    }, 150)
  }, [score])

  return (
    <ScScorebox className={highlighted ? 'highlighted' : ''}>
      <p>{score}</p>
    </ScScorebox>
  );
}

export default ScoreBox;
