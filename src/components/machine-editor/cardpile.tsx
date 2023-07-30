import { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';
import { AppContext } from '../../store/appcontext';

const ScWrapper = styled.div`
  position: absolute;
  bottom: 0rem;

  &.active {
    cursor: pointer;

    li{
      background-color: var(--co-card-secondary);
    }
    li:hover{
      background-color: var(--co-card-primary);
    }
  }
`;

const ScLabel = styled.span`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
`;

const ScCardWrapper = styled.ul``;

const ScTile = styled.li`
  left: 0;
  bottom: 0;
  position: absolute;
  background-color: var(--color-grey);
  border: var(--border-width-small) solid white;
  border-radius: 1rem;
  box-shadow: -1px -1px 1px 1px var(--color-grey);
  width: 6rem;
  height: 6rem;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  padding-bottom: 0.5rem;
`;


const CARD_SPACING = [ 0.5, 0.75 ];
const renderCardStyle = (cardIdx: number) => ({
  left: `${cardIdx * CARD_SPACING[0]}px`,
  bottom: `${cardIdx * CARD_SPACING[1]}px`,
  transform: `translate(calc(-50% + ${cardIdx * CARD_SPACING[0]}px), -${cardIdx * CARD_SPACING[1]}px)`
})

interface Props {
  cards: number[];
  disabled?: boolean;
  type: 'draw' | 'discard';
}
function CardPile({ cards, type, disabled }: Props) {
  const { drawCards, deckState } = useContext(AppContext);

  const onDraw = useCallback(() => {
    if (deckState.drawn.length === 0) {
      console.log('onDraw');
      drawCards(3);
    }
  }, [drawCards, deckState.drawn.length]);

  const canDraw = useMemo(() => {
    return !disabled && type === 'draw' && deckState.draw.length > 0 && deckState.drawn.length === 0;
  }, [deckState.drawn.length, deckState.draw.length, type, disabled]);

  return (
    <ScWrapper className={canDraw ? 'active' : ''} onClick={onDraw}>
      <ScCardWrapper>
        {cards.map((_, cIdx) => (
          <ScTile key={cIdx} style={renderCardStyle(cIdx)}>
            <p>{cards.length}</p>
          </ScTile>
        ))}
      </ScCardWrapper>
      <ScLabel>{type === 'draw' ? 'DRAW' : 'DISCARD'}</ScLabel>
    </ScWrapper>
  );
}

export default CardPile;
