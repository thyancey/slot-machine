import styled from 'styled-components';
import { AppContext } from '../../../store/appcontext';
import { useContext, useEffect, useState } from 'react';
import { convertToDollaridoos } from '../../../utils';

const ScScorebox = styled.div`
  padding: .5rem 0.25rem 0.25rem 0.25rem;
  background-color: var(--color-black);
  overflow:hidden;
  text-align: right;
  width:100%;
  height:100%;
  transition: color .25s ease-in-out, font-size .25s ease-in-out;
  font-size: 3rem;

  &.highlighted{
    color: var(--color-white-light);
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
      <p>{convertToDollaridoos(score)}</p>
    </ScScorebox>
  );
}

export default ScoreBox;
