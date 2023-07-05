import styled from 'styled-components';
import { useContext } from 'react';
import Player from './player';
import Enemy from './enemy';
import { AppContext } from '../../store/appcontext';

const ScWrapper = styled.main`
  flex: 1;
  padding: 5rem;
  position: relative;
`;

const ScCenterer = styled.div`
  position: absolute;

  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ScHolder = styled.div`
  position: absolute;

  transition: top 0.2s ease-in-out, right 0.2s ease-in-out, transform 0.2s ease-in-out, opacity 0.2s ease-in-out;

  .player-focused & {
    &#entity-player {
      z-index: 1;
      top: 0rem;
      right: 0rem;
      opacity: 1;
    }
    &#entity-enemy {
      top: -25rem;
      right: -20rem;
      transform: scale(0.6);
      opacity: 0.5;
    }
  }
  .enemy-focused & {
    &#entity-player {
      top: -15rem;
      right: -15rem;
      transform: scale(0.6);
      opacity: 0.5;
    }
    &#entity-enemy {
      z-index: 1;
      top: 0rem;
      right: 0rem;
      opacity: 1;
    }
  }

  > div {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

/* Manages the player/enemy cards and how they show on screen? */
export const Entities = () => {
  const { playerFocused } = useContext(AppContext);

  return (
    <ScWrapper>
      <ScCenterer className={playerFocused ? 'player-focused' : 'enemy-focused'}>
        <ScHolder id='entity-player'>
          <Player />
        </ScHolder>
        <ScHolder id='entity-enemy'>
          <Enemy />
        </ScHolder>
      </ScCenterer>
    </ScWrapper>
  );
};

export default Entities;
