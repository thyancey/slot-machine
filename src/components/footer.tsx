import styled from 'styled-components';
import ScoreBox from './scorebox';

const ScWrapper = styled.footer`
`;

const ScScoreContainer = styled.div`
  position: absolute;
  bottom: -1.5rem;
  left: 50%;
  transform: translate(-50%);
  border: var(--border-width) solid var(--color-pink);
  border-radius: 1.5rem;
  background-color: var(--color-grey);
  text-align: center;
  z-index:2;
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
