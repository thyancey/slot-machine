import styled from 'styled-components';
import { MixinBorders } from '../utils/styles';
import { getRandomIdx } from '../utils';

export const ScWrapper = styled.div`
  position:absolute;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

type ScPaletteProps = {
  $bgColor: string;
  $topColor: string;
  $sideColor: string;
}
export const ScPalette = styled.div<ScPaletteProps>`
  background-color: var(${(p) => p.$bgColor});
  flex: 0;
  width: 12rem;
  height: 7rem;
  padding: 1rem;

  div {
    width: 10rem;
    height: 5rem;

    ${p => MixinBorders(p.$topColor, p.$sideColor)}
    background-color: transparent;
  }
`;

interface PaletteProps {
  color: string;
}
function PaletteItem({ color }: PaletteProps) {
  return (
    <ScPalette $bgColor={`--color-${color}`} $topColor={`--color-${color}-dark`} $sideColor={`--color-${color}-light`}>
      <div />
    </ScPalette>
  );
}

function Palette() {
  const colors = [ 'red', 'blue', 'green', 'yellow', 'grey', 'black', 'white'];
  const numColors = 200;

  const randColors = Array(numColors)
    .fill('')
    .map(() => colors[getRandomIdx(colors)]);

  return (
    <ScWrapper>
      {randColors.map((c, idx) => (
        <PaletteItem key={idx} color={c} />
      ))}
    </ScWrapper>
  );
}

export default Palette;
