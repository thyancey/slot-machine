import styled from 'styled-components';
import ScoreBox from './scorebox';

const ScWrapper = styled.footer`
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: center;
`;

const ScScoreContainer = styled.div`
  border: var(--border-width) solid var(--color-pink);
  border-radius: 1.5rem;
  background-color: var(--color-grey);
  margin-bottom: -1rem;
  text-align: center;
`;

function Footer() {
  return (
    <ScWrapper>
      <ScScoreContainer>
        <ScoreBox />
      </ScScoreContainer>
    </ScWrapper>
  );
}

export default Footer;
