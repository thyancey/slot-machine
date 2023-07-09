import styled from 'styled-components';
import { EffectGroup } from '../../store/data';
import { useMemo } from 'react';

const ScWrapper = styled.div`
  position: absolute;
  left: 0rem;
  right: 0;
  bottom: 0;
  padding: 0 0rem;
  z-index: 2; // just makes the hover state of the cards simpler
`;

const ScStatLabels = styled.ul`
  > li {
    display: inline-block;
    vertical-align: bottom;
    width: 3rem;
  }
`;

const ScHealthBar = styled.div`
  position: absolute;
  background-color: var(--color-grey);
  border: 0.5rem solid var(--color-black);

  top: 1.85rem;
  border-radius: 1rem;
  height: 3rem;
  position: relative;

  color: var(--color-white);

  text-align: center;
  width: 100%;
  z-index: -1;

  p {
    margin-top: -0.25rem;
    font-size: 1.5rem;
  }
`;

const ScHealthBarBg = styled.div`
  position: absolute;
  background-color: var(--color-red);
  border: 0.25rem solid var(--color-grey);

  .defended & {
    background-color: var(--color-blue);
  }

  /* width % (0-100) is controlled inline by component */
  transition: width 0.2s ease-in;

  top: 0;
  left: 0;
  bottom: 0;
  border-radius: 0.65rem;
  z-index: -1;
`;

const ScDefenseBox = styled.div`
  position: absolute;
  left: 0rem;
  bottom: -2.5rem;
  width: 4rem;
  height: 4.5rem;
  border-radius: 0 0 2rem 2rem;
  background-color: var(--color-blue);
  border: 0.5rem solid var(--color-black);
  z-index: 1;

  color: var(--color-black);
  line-height: 3rem;
  font-size: 2rem;
  text-align: center;
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
const HealthBar = ({ hp, hpMax, defense, buffs }: PropsEntityStats) => {
  const healthPerc = useMemo(() => {
    return Math.floor((hp / hpMax) * 100);
  }, [hp, hpMax]);

  return (
    <ScWrapper className={defense !== 0 ? 'defended' : ''}>
      <ScStatLabels>
        {/* {(defense && <StatLabel type='defense' size={'lg'} value={defense}></StatLabel>) || null} */}
        {/* <StatLabel type={'hp'} size={'lg'} value={`${hp} / ${hpMax}`}></StatLabel> */}
      </ScStatLabels>
      {defense !== 0 && (
        <ScDefenseBox>
          <p>{defense}</p>
        </ScDefenseBox>
      )}
      <ScHealthBar>
        <p>{`${hp} / ${hpMax}`}</p>
        <ScHealthBarBg style={{ width: `${healthPerc}%` }} />
      </ScHealthBar>
    </ScWrapper>
  );
};
export default HealthBar;
