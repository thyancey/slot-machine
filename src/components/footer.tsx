import styled from 'styled-components';
import { AppContext } from '../store/appcontext';
import { useContext, useMemo } from 'react';
import Button from './button';

const ScWrapper = styled.footer`
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: center;
`;

const ScTurnBox = styled.div`
  border: var(--border-width-small) solid var(--color-purple);
  border-radius: 1rem 0 0 0;
  background-color: var(--color-grey);
  border-right: none;
  border-bottom: none;
  margin-bottom: -5rem;
  padding: 0.75rem 1rem 0.5rem 1rem;
  text-align: center;
  margin-right: -0.5rem;
  margin-left: 1rem;

  p {
    margin: 0;
    padding: 0;
    font-size: 2rem;
    line-height: 2rem;
  }
`;

function Footer() {
  const { turn, finishTurn, round, setRound, reelResults } = useContext(AppContext);

  const resultsReady = useMemo(() => {
    return !reelResults.includes(-1);
  }, [reelResults]);

  return (
    <ScWrapper>
      <ScTurnBox>
        <p>{`Round #${round + 1}`}</p>
      </ScTurnBox>
      {/* TODO, disable when enemy is alive */}
      <Button onClick={() => setRound((prev) => prev + 1)}>{'Next round'}</Button>
      <ScTurnBox>
        <p>{`Turn #${turn + 1}`}</p>
      </ScTurnBox>
      <Button disabled={turn === -1 || !resultsReady} onClick={() => finishTurn()}>
        {'Next turn'}
      </Button>
    </ScWrapper>
  );
}

export default Footer;
