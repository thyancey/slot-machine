import { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../../store/appcontext';
import CardPile from './cardpile';

const ScWrapper = styled.div`
  z-index:5;
`;

const ScCardWrapper = styled.div`

  position: fixed;
  bottom:0;
  width: 100%;

  &:last-child{
    ul{
      right:0;
    }
  }
`

function Deck() {
  const { deckState } = useContext(AppContext);
  console.log('deck', deckState);

  return (
    <ScWrapper>
      <ScCardWrapper>
        <CardPile cards={deckState.draw} />
      </ScCardWrapper>
      <ScCardWrapper>
        <CardPile cards={deckState.discard} />
      </ScCardWrapper>
    </ScWrapper>
  );
}

export default Deck;
