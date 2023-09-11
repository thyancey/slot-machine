import styled from 'styled-components';
import { EffectGroup, Tile } from '../../../store/data';
import StatLabel from './stat-label';
import { ReactElement, useMemo } from 'react';

interface ScProps {
  $height: number;
}
const ScWrapper = styled.div<ScProps>`
  width: 100%;
  height: ${(p) => p.$height}px;
  color: var(--color-black);
  text-align: center;
  border-bottom: 0.25rem dashed var(--co-reel-divider);

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;

  padding: 1rem;
  position: relative;


  p {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    font-size: 3rem;
    color: var(--color-white);
    -webkit-text-stroke: 2px var(--color-black);
    text-shadow: 2px 2px 0 var(--color-black), -2px -2px 0 var(--color-black), 2px -2px 0 var(--color-black),
      -2px 2px 0 var(--color-black), 2px 2px 0 var(--color-black);
  }

  > img {
    width: 100%;
    filter: var(--filter-shadow1);
  }
`;

const ScStatLabels = styled.ul`
  position: absolute;
  bottom: -0.5rem;
  text-align: center;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.2s;

  background-color: var(--color-black);

  > li {
    display: inline-block;
    vertical-align: middle;
    width: 2rem;
  }

  .lit-up & {
    opacity: 1;
  }
`;

interface Props {
  tile: Tile;
  height: number;
  isActive: boolean;
}

function ReelContent({ tile, height, isActive }: Props) {

  // get x StatLabels for each value
  // const items = useMemo(() => {
  //   return tile.effects.reduce((acc: ReactElement[], effect: EffectGroup) => {
  //     return acc.concat(
  //       Array.from({ length: effect.value }).map((_, idx) => (
  //         <StatLabel key={idx} type={effect.type} value={effect.value} />
  //       ))
  //     );
  //   }, []);
  // }, [tile.effects]);

  const items = useMemo(() => {
    return tile.effects.map((effect, idx) => <StatLabel key={idx} type={effect.type} value={effect.value} />)
  }, [tile.effects]);

  return (
    <ScWrapper $height={height}>
      <img src={tile.img || ''} />
      {isActive && <ScStatLabels>{items.map((i) => i)}</ScStatLabels>}
    </ScWrapper>
  );
}

export default ReelContent;
