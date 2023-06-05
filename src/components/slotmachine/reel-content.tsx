import styled from 'styled-components';
import { ReelItem } from './reel-data';

interface ScProps {
  height: number;
}
const ScWrapper = styled.div<ScProps>`
  width: 100%;
  height: ${(p) => p.height}px;
  background-color: var(--color-white);
  color: var(--color-black);
  text-align: center;
  border-bottom: 0.25rem solid var(--color-blue);

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;

  padding: 0.25rem;
  position: relative;

  p {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    font-size: 3rem;
    color: var(--color-teal);
    -webkit-text-stroke: 2px var(--color-black);
    text-shadow: 2px 2px 0 var(--color-black), -2px -2px 0 var(--color-black),
      2px -2px 0 var(--color-black), -2px 2px 0 var(--color-black),
      2px 2px 0 var(--color-black);
  }

  img {
    width: 100%;
    filter: drop-shadow(0.2rem 0.2rem 0.1rem var(--color-black));
  }
`;

type Props = {
  reelItem: ReelItem;
  height: number;
};

function ReelContent({ reelItem, height }: Props) {
  return (
    <ScWrapper height={height}>
      <p>{reelItem.idx}</p>
      <img src={reelItem.img || ''} />
    </ScWrapper>
  );
}

export default ReelContent;
