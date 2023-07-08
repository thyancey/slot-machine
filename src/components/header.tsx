import styled from 'styled-components';
import ScoreBox from './scorebox';

const ScWrapper = styled.header`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ScScoreContainer = styled.div`
  border: var(--border-width) solid var(--color-pink);
  border-radius: 1.5rem;
  background-color: var(--color-grey);
  margin-top: -1rem;
  text-align:center;
`;

function Header() {
  return (
    <ScWrapper>
    </ScWrapper>
  );
}

export default Header;
