import styled from 'styled-components';
import StatLabel from '../slotmachine/components/stat-label';
import { EffectGroup } from '../../store/data';

const ScWrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 100%;
  width: 100%;
  padding: 0 2rem;
  z-index: 2; // just makes the hover state of the cards simpler

  display: flex;
  justify-content: space-between;
`;

const ScStatLabels = styled.ul`
  > li {
    display: inline-block;
    vertical-align: bottom;
    width: 5rem;
  }
`;

export interface StatInfo {
  [key: string]: number;
}

interface PropsEntityStats {
  attack: number;
  modifiers: EffectGroup[];
}

const AttackBar = ({ attack, modifiers }: PropsEntityStats) => {
  return (
    <ScWrapper>
      <ScStatLabels>
        {attack && <StatLabel key='attack' type='attack' size={'lg'} value={attack}></StatLabel>}
        {modifiers
          .map((eg: EffectGroup) => {
            return eg.value !== 0 ? (
              <StatLabel key={eg.type} type={eg.type} size={'lg'} value={eg.value}></StatLabel>
            ) : null;
          })
          .filter((l) => l !== null)}
      </ScStatLabels>
    </ScWrapper>
  );
};
export default AttackBar;
