import { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';
import { AppContext } from '../../store/appcontext';
import { clamp } from '../../utils';

const ScWrapper = styled.div`
  position: absolute;
  bottom: 0rem;

  li {
    background-color: var(--color-grey);
    color: var(--color-black-light);
  }
  
  &.active {
    cursor: pointer;

    li {
      background-color: var(--color-purple-dark);
      color: var(--color-white);
    }
    li:hover {
      background-color: var(--color-purple-light);
    }
  }
`;

const ScLabel = styled.span`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
`;

const ScCardWrapper = styled.ul`
  position: absolute;
  left: -1.5rem;
  bottom: 2rem;
`;

const ScTile = styled.li`
  left: 0;
  bottom: 0;
  position: absolute;
  border-radius: 0.25rem;

  box-shadow: 2px -2px 1px 2px var(--color-black-light);
  width: 6rem;
  height: 8rem;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  padding-bottom: 0.5rem;
`;

const CARD_SPACING = [-12, -10];
const renderCardStyle = (cardIdx: number) => ({
  left: `${cardIdx * CARD_SPACING[0]}px`,
  bottom: `${cardIdx * CARD_SPACING[1]}px`,
});

interface Props {
  cards: number[];
  disabled?: boolean;
  type: 'draw' | 'discard';
}
function CardPile({ cards, type, disabled }: Props) {
  const { drawCards, deckState } = useContext(AppContext);

  const onDraw = useCallback(() => {
    if (deckState.drawn.length === 0) {
      drawCards(3);
    }
  }, [drawCards, deckState.drawn.length]);

  const canDraw = useMemo(() => {
    return !disabled && type === 'draw' && deckState.draw.length > 0 && deckState.drawn.length === 0;
  }, [deckState.drawn.length, deckState.draw.length, type, disabled]);

  const drawPile = useMemo(() => {
    return Array(clamp(cards.length, 0, 4)).fill(null);
  }, [cards.length]);

  return (
    <ScWrapper className={canDraw ? 'active' : ''} onClick={onDraw}>
      <ScCardWrapper>
        {drawPile.map((_, cIdx) => (
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
