import styled from 'styled-components';
import Player from './player';
import Enemy from './enemy';

const ScWrapper = styled.main`
  flex: 1;
  padding: 2rem;
  display: grid;
  grid-template-columns: min-content;
  grid-template-rows: min-content min-content;
  align-content: center;
  justify-content: center;
  grid-gap: 1rem;
`;

/* Manages the player/enemy cards and how they show on screen? */
export const Entities = () => {
  return (
    <ScWrapper>
      <Enemy />
      <Player />
    </ScWrapper>
  );
};

export default Entities;
