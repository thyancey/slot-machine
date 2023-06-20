import styled from 'styled-components';
import { AppContext } from '../store/appcontext';
import { useContext } from 'react';

const ScWrapper = styled.header`
  /* border-bottom: 0.75rem solid var(--color-pink); */
  background-color: var(--color-grey);
  color: var(--color-white);
  z-index: 1;

  padding: 0rem;

  width: 100%;
  display: flex;
  align-items: start;
  justify-content: center;
`;

const ScScorebox = styled.div`
  border: var(--border-width-small) solid var(--color-pink);
  border-radius: 0 0 1rem 1rem;
  position: absolute;
  border-top: none;
  margin-top: -0.5rem;
  padding: 0.25rem 0.25rem;
  width: 50%;
  background-color: var(--color-grey);
  text-align:left;

  p {
    margin: 0;
    padding: 0;
    font-size: 3rem;
    line-height: 3rem;
  }
`;

function Header() {
  const { score } = useContext(AppContext);

  return (
    <ScWrapper>
      <ScScorebox>
        <p>{score}</p>
      </ScScorebox>
    </ScWrapper>
  );
}

export default Header;
