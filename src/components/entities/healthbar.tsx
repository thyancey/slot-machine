import styled from 'styled-components';
import StatLabel from '../slotmachine/components/stat-label';
import { EffectGroup } from '../../store/data';

const ScWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 2rem;
  z-index: 2; // just makes the hover state of the cards simpler
`;

const ScStatLabels = styled.ul`
  > li {
    display: inline-block;
    vertical-align: bottom;
    width: 3rem;
  }
`;

export interface StatInfo {
  [key: string]: number;
}

interface PropsEntityStats {
  hp: number;
  defense: number;
  buffs: EffectGroup[];
}
const HealthBar = ({ hp, defense, buffs }: PropsEntityStats) => {
  return (
    <ScWrapper>
      <ScStatLabels>
        {(defense && <StatLabel type='defense' size={'lg'} value={defense}></StatLabel>) || null}
        <StatLabel type={'hp'} size={'lg'} value={hp}></StatLabel>
      </ScStatLabels>
    </ScWrapper>
  );
};
export default HealthBar;
