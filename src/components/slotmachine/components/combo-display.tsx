import styled from 'styled-components';
import { ReelCombo, ReelComboResult } from '../../../store/data';

const ScWrapper = styled.div`
  position: absolute;
  inset: 0;
  background-color: var(--color-grey);
  color: var(--color-white);
  border-radius: 0.6rem;
  padding: 1rem;

  font-family: var(--font-8bit2);
  transition: background-color ease-out .2s, color ease-out .2s;

  ul,li,span,p {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 1.5rem;
    line-height: 1.85rem;
  }

  &.winner {
    background-color: var(--color-pink);
    color: var(--color-white);
  }
`;

const ScCombos = styled.ul`
  li{
    font-size: 1rem;
    line-height: 1.25rem;
  }
`;

const ScStatus = styled.div``;

type Props = {
  numReels: number;
  reelCombos: ReelCombo[];
  activeCombos: ReelComboResult[];
};
function Display({ reelCombos, activeCombos, numReels = 1 }: Props) {
  if (activeCombos.length === 0) {
    return (
      <ScWrapper>
        <p>{'possible combos'}</p>
        <ScCombos>
          {reelCombos?.map((rC) => (
            <li key={rC.label}>{`${rC.label}: ${rC.attributes.join(',')} x ${numReels}`}</li>
          ))}
        </ScCombos>
      </ScWrapper>
    );
  } else {
    return (
      <ScWrapper className={'winner'}>
        <ScStatus>
          <p>{' YOU WIN! '}</p>
          <p>{`${activeCombos[0].label}`}</p>
          <p>{`"${activeCombos[0].bonus?.bonusType}" bonus!`}</p>
          <p>{`x${activeCombos[0].bonus?.multiplier} multiplier`}</p>
        </ScStatus>
      </ScWrapper>
    );
  }
}

export default Display;
