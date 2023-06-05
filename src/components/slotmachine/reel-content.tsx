import styled from 'styled-components';
import { ReelItem } from './reel-data';


interface ScProps {
  height: number
}
const ScWrapper = styled.div<ScProps>`
  width: 100%;
  height: ${p => p.height}px;
  background-color: var(--color-white);
  color: var(--color-black);
  text-align: center;
  border-bottom: 0.25rem solid var(--color-blue);

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;

  padding: .25rem;

  img {
    width:100%;
    filter: drop-shadow(.2rem .2rem .1rem var(--color-black));
  }
`;


type Props = {
  reelItem: ReelItem,
  height: number
};

function ReelContent({reelItem, height}: Props) {
  return (
    <ScWrapper height={height}>
      <p>{reelItem.idx}</p>
      {/* <img src={reelItem.img || ''}/> */}
    </ScWrapper>
  );
}

export default ReelContent;
