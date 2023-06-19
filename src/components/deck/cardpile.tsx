import styled from 'styled-components';

interface ScWrapperProps {
  offset: number;
}
const ScWrapper = styled.ul`
  position: absolute;
  bottom: 2rem;
  width: 11rem;
  height: 1rem;
`;

const ScTiles = styled.ul``

const CARD_SPACING = 2.5;

const ScTile = styled.li<ScWrapperProps>`
  left: ${(p) => `${p.offset * CARD_SPACING * .5}px`};
  bottom: ${(p) => `${p.offset * CARD_SPACING}px`};
  position: absolute;
  background-color: var(--color-pink);
  border: var(--border-width-small) solid white;
  border-radius: 1rem;
  box-shadow: -1px -1px 1px 1px var(--color-grey);
  width: 8rem;
  height: 10rem;

  display:flex;
  justify-content:center;
  align-items:center;
  font-size: 3rem;
  padding-bottom: 1rem;
`;

interface Props {
  cards: number[];
}
function CardPile({ cards }: Props) {
  return (
    <ScWrapper>
      <ScTiles>
        {cards.map((c, cIdx) => (
          <ScTile key={cIdx} offset={cIdx}>
            <span>{cards.length}</span>
          </ScTile>
        ))}
      </ScTiles>
    </ScWrapper>
  );
}

export default CardPile;
