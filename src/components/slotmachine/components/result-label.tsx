import styled from 'styled-components';
import { ReelComboResult, Tile } from '../../../store/data';
import { useEffect, useMemo, useState } from 'react';
import StatLabel from './stat-label';

const ScWrapper = styled.div`
  width: var(--val-reel-width);
  height: 2rem;
  margin: 0.5rem;
  position: relative;
`;

const ScAnimator = styled.div`
  position: absolute;
  inset: 0;
  top: 0rem;
  transition: top 0.2s cubic-bezier(0.62, 3, 0.8, 0.68), opacity 0.2s;

  .lf-present & {
    top: 0rem;
    opacity: 1;
  }
  .lf-new & {
    top: -1rem;
    opacity: 1;
  }
  .lf-none & {
    top: -2rem;
    opacity: 0;
    > div {
      height: 1rem;
    }
    transition: top 0.2s cubic-bezier(0.46, 0, 0.78, -0.71), opacity 0.2s 0.1s;
  }
`;

const ScPill = styled.div`
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  box-shadow: 0px 2px 5px 1px var(--color-grey);
  text-align: center;
  font-size: 1.5rem;
  font-family: var(--font-8bit2);

  .lf-none & {
    height: 1rem;
    background-color: var(--color-grey);
    transition: background-color 1s, height 0.2s;
  }
`;

const ScScorePill = styled(ScPill)`
  background-color: var(--color-grey);
  transition: background-color 0.2s;
  color: var(--color-white);

  .lit-up & {
    background-color: var(--color-purple);
  }
  .lf-none & {
    height: 1rem;
    background-color: var(--color-grey);
    transition: background-color 1s, height 0.2s;
  }
`;

const ScAttrPill = styled(ScPill)`
  font-size: 1.5rem;
  height: 1rem;
  padding: 1rem;
  margin-top: -2.5rem;
  opacity: 0;
  transition: margin-top 0.3s, opacity 0.3s;

  &.active {
    margin-top: -0.5rem;
    opacity: 1;
  }

  .lf-present & {
    background-color: var(--color-pink);
    color: var(--color-white);
    box-shadow: 0px 0px 15px 3px var(--color-pink);
  }
  .lf-none & {
    height: 1rem;
    background-color: var(--color-grey);
  }
`;

const ScStatPlacement = styled.div`
  position: absolute;

  &.top{
    right: 0.5rem;
    top: -11.5rem;
  }
  &.bottom{
    right: 0.5rem;
    top: -5.5rem;
  }
`

export function EmptyResultLabel() {
  return (
    <ScWrapper className={'lf-none'}>
      <ScAnimator>
        <ScPill></ScPill>
        <ScAttrPill></ScAttrPill>
      </ScAnimator>
    </ScWrapper>
  );
}

interface Props {
  tile: Tile;
  activeCombos: ReelComboResult[];
}
function ResultLabel({ activeCombos, tile }: Props) {
  const [lifecycle, setLifecycle] = useState<string>('lf-none');

  useEffect(() => {
    setLifecycle('lf-new');
    window.setTimeout(() => {
      setLifecycle('lf-present');
    }, 1);
  }, [tile.label]);

  const matchingAttributes = useMemo(() => {
    // console.log('matching with ',tile.attributes, activeCombos);
    return tile.attributes.filter(
      // if attribute matches with combo, or wildcard match for either
      (a) => !!activeCombos.find((aC) => aC.attribute === a || aC.attribute === '*' || a === '*')
    );
  }, [tile.attributes, activeCombos]);


  return (
    <ScWrapper className={lifecycle}>
      <ScAnimator>
        <ScAttrPill className={matchingAttributes.length > 0 ? 'active' : ''}>
          <span>{matchingAttributes.join(',').toUpperCase()}</span>
          {tile.effects.map((effect) => (
            <StatLabel key={effect.type} type={effect.type} value={effect.value} />
          ))}
        </ScAttrPill>
        <ScScorePill>
          <span>{`$${tile.score || 0}`}</span>
        </ScScorePill>
      </ScAnimator>
    </ScWrapper>
  );
}

export default ResultLabel;
