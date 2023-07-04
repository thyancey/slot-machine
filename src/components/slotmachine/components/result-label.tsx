import styled from 'styled-components';
import { Tile } from '../../../store/data';
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

  ${ScWrapper}.lf-new & {
    top: -1rem;
    opacity: 1;
  }
  ${ScWrapper}.lf-present & {
    top: 0rem;
    opacity: 1;
  }
  ${ScWrapper}.lf-none & {
    top: -2rem;
    opacity: 0;
    > div {
      height: 1rem;
    }
    transition: top 0.2s cubic-bezier(0.46, 0, 0.78, -0.71), opacity 0.2s 0.1s;
  }

  ${ScWrapper}.special.lf-new & {
    top: -3rem;
  }
  ${ScWrapper}.special.lf-present & {
    top: -1rem;
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

  ${ScWrapper}.lf-none & {
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
  ${ScWrapper}.lf-none & {
    height: 1rem;
    background-color: var(--color-grey);
    transition: background-color 1s, height 0.2s;
  }

  ${ScWrapper}.special & {
    background-color: var(--color-purple);
    height: 4rem;
  }
  
  .lit-up ${ScWrapper}.special & {
    background-color: var(--color-pink);
  }
`;

const ScStatLabels = styled.ul`
  position: absolute;
  right: 0;
  bottom: 5.5rem;
  text-align: right;
  > li {
    display: inline-block;
    vertical-align: middle;
    width: 2rem;
  }
`;
export function EmptyResultLabel() {
  return (
    <ScWrapper className={'lf-none'}>
      <ScAnimator>
        <ScPill></ScPill>
      </ScAnimator>
    </ScWrapper>
  );
}

interface BasicLabelProps {
  label: string;
  isSpecial?: boolean;
}
export function BasicLabel({ label, isSpecial }: BasicLabelProps) {
  const [lifecycle, setLifecycle] = useState<string>('lf-none');

  useEffect(() => {
    setLifecycle('lf-new');
    window.setTimeout(() => {
      setLifecycle('lf-present');
    }, 1);
  }, [label]);

  const className = useMemo(() => {
    const classes = [lifecycle];
    if (isSpecial) classes.push('special');
    return classes.join(' ');
  }, [lifecycle, isSpecial]);

  return (
    <ScWrapper className={className}>
      <ScAnimator>
        <ScScorePill>
          <span>{label}</span>
        </ScScorePill>
      </ScAnimator>
    </ScWrapper>
  );
}

interface StatsLabelProps {
  tile: Tile;
}
export function StatsLabel({ tile }: StatsLabelProps) {
  return (
    <ScWrapper className={'lf-present'}>
      <ScStatLabels>
        {tile.effects.map((effect) => (
          <StatLabel key={effect.type} type={effect.type} value={effect.value} />
        ))}
      </ScStatLabels>
    </ScWrapper>
  );
}

export default null;
