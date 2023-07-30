import styled from 'styled-components';
import { getRandomIdx } from './slotmachine/utils';

export const ScWrapper = styled.div`
  position:absolute;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const ScPalette = styled.div`
  background-color: var(--color-${(p) => p.color});
  flex: 0;
  width: 12rem;
  height: 7rem;
  padding: 1rem;

  div {
    width: 10rem;
    height: 5rem;

    border-top: var(--val-depth) solid var(--color-${(p) => p.color}-dark);
    border-bottom: var(--val-depth) solid var(--color-${(p) => p.color}-dark);
    border-left: var(--val-depth) solid var(--color-${(p) => p.color}-light);
    border-right: var(--val-depth) solid var(--color-${(p) => p.color}-light);
    background-color: transparent;
    /* background-color: var(--color-black); */
  }
`;

interface PaletteProps {
  color: string;
}
function PaletteItem({ color }: PaletteProps) {
  return (
    <ScPalette color={color}>
      <div />
    </ScPalette>
  );
}

function Palette() {
  const colors = [ 'purple', 'red', 'blue', 'green', 'yellow', 'grey', 'black', 'white'];
  const numColors = 200;

  // const randColors = pickRandomFromArray(numColors, colors) as string[];
  const randColors = Array(numColors)
    .fill('')
    .map(() => colors[getRandomIdx(colors)]);

  return (
    <ScWrapper>
      {randColors.map((c) => (
        <PaletteItem key={c} color={c} />
      ))}
    </ScWrapper>
  );
}

export default Palette;
