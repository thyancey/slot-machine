import styled from 'styled-components';
import { ReelCombo } from './reel-data';
import { useState } from 'react';

const ScWrapper = styled.div`
  /* height: 10rem; */
  position: absolute;
  inset: 0;
  background-color: var(--color-grey);
  border-radius: 0.6rem;
  padding: 1rem;
  /* width: calc(100% - 2rem); */
  /* margin: 1rem auto; */

  font-family: var(--font-8bit2);

  ul, li{
    margin:0;
    padding:0;
    list-style:none;
  }
`;

const ScCombos = styled.ul`
  
`

const ScStatus = styled.span`
  font-size: 3rem;
  color: var(--color-white);
`;

type Props = {
  numReels: number;
  reelCombos: ReelCombo[];
};
function Display({ reelCombos, numReels = 1 }: Props) {
  const [status, setStatus] = useState('win');

  if (status === 'idle') {
    return (
      <ScWrapper>
        <ScCombos>
          {reelCombos?.map((rC) => (
            <li key={rC.label}>{`${rC.label}: ${rC.attributes.join(',')} x ${numReels}`}</li>
          ))}
        </ScCombos>
      </ScWrapper>
    );
  } else if (status === 'win') {
    return (
      <ScWrapper>
        <ScStatus />
          {'YOU WIN!'}
        <ScStatus />
      </ScWrapper>
    );
  }

  return <ScWrapper></ScWrapper>;
}

export default Display;
