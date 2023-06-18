import styled from 'styled-components';
import { AppContext } from '../store/appcontext';
import { useContext } from 'react';

const ScWrapper = styled.header`
  border-bottom: 0.75rem solid var(--color-pink);
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
  border: 1rem solid var(--color-pink);
  border-radius: 1.5rem;
  position: absolute;
  margin-top: -1.75rem;
  padding: 0 2rem;
  font-size: 4rem;
  background-color: var(--color-grey);

  p {
    margin: 0;
    padding: 0;
  }
`;

interface Props {
}
function Header({}: Props) {
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
