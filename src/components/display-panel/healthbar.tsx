import styled from 'styled-components';
import { EffectGroup } from '../../store/data';
import { useMemo } from 'react';

const ScWrapper = styled.div`
  position: absolute;
  width: calc(100% - 2rem);

  top: -1.5rem;
  padding: 0 0rem;
`;

const ScHealthBar = styled.div`
  position: absolute;
  border: 0.25rem solid var(--color-white);

  top: 1.85rem;
  border-radius: .5rem;
  height: 2rem;
  position: relative;

  color: var(--color-white);

  text-align: center;
  width: 100%;

  p {
    position: absolute;
    inset: 0;
    font-size: 1.5rem;
    margin-top: -0.4rem;
  }
`;

const ScHealthBarBg = styled.div`
  position: absolute;
  background-color: var(--co-health);

  .defended & {
    background-color: var(--co-defense);
  }

  /* width % (0-100) is controlled inline by component */
  transition: width 0.2s ease-in;

  top: 0;
  left: 0;
  bottom: 0;
  border-radius: .25rem;
`;

const ScDefenseBox = styled.div`
  position: absolute;
  left: -0.25rem;
  bottom: -2.25rem;
  width: 2.5rem;
  height: 3rem;
  border-radius: 0 0 2rem 2rem;
  background-color: var(--co-defense);
  opacity: 0;
  border: 0.25rem solid var(--color-white);
  color: var(--color-white);

  line-height: 2.25rem;
  font-size: 1.5rem;
  text-align: center;

  .defended & {
    opacity: 1;
  }
`;

export interface StatInfo {
  [key: string]: number;
}

interface PropsEntityStats {
  hp: number;
  hpMax: number;
  defense: number;
  buffs: EffectGroup[];
}
const HealthBar = ({ hp, hpMax, defense }: PropsEntityStats) => {

  const healthPerc = useMemo(() => {
    return Math.floor((hp / hpMax) * 100);
  }, [hp, hpMax]);

  return (
    <ScWrapper className={defense !== 0 ? 'defended' : ''}>
      <ScHealthBar>
        <ScHealthBarBg style={{ width: `${healthPerc}%` }} />
        <p>{`${hp} / ${hpMax}`}</p>
      </ScHealthBar>
      <ScDefenseBox>{defense !== 0 && <p>{defense}</p>}</ScDefenseBox>
    </ScWrapper>
  );
};
export default HealthBar;
