import styled from 'styled-components';
import { AppContext } from '../store/appcontext';
import { useContext } from 'react';
import Button from './button';

const ScWrapper = styled.header`
  /* border-bottom: 0.75rem solid var(--color-pink); */
  /* background-color: var(--color-grey); */
  color: var(--color-white);
  z-index: 1;

  padding: 0rem;

  width: 100%;
  display: flex;
  align-items: start;
  justify-content: center;
`;

const ScTurnBox = styled.div`
  border: var(--border-width-small) solid var(--color-purple);
  border-radius: 0 0 0rem 1rem;
  background-color: var(--color-grey);
  border-right: none;
  border-top: none;
  margin-top: -0.5rem;
  padding: 0.75rem 1rem 0.5rem 1rem;
  text-align:center;
  margin-right: -0.5rem;

  p {
    margin: 0;
    padding: 0;
    font-size: 2rem;
    line-height: 2rem;
  }
`;

function Header() {
  const { turn, nextTurn, spinTokens } = useContext(AppContext);

  return (
    <ScWrapper>
      <ScTurnBox>
        <p>{`Turn #${turn + 1}`}</p>
      </ScTurnBox>
      <Button disabled={spinTokens > 0} onClick={() => nextTurn()}>
        {'Next turn'}
      </Button>
    </ScWrapper>
  );
}

export default Header;
