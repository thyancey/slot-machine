import styled from 'styled-components';
import { ReelItem } from './reel-data';
import { useEffect, useState } from 'react';

const ScWrapper = styled.div`
  width: 8rem;
  height: 2rem;
  margin: 0.5rem;
  position: relative;
`;

const ScAnimator = styled.div`
  position: absolute;
  inset: 0;
  top: 0rem;
  transition: top .2s cubic-bezier(.62,3,.8,.68), opacity .2s;
  

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
    >div{
      height:1rem;
    }
    transition: top .2s cubic-bezier(.46,0,.78,-0.71), opacity .2s .1s;
  }
`;

const ScPill = styled.div`
  width: 8rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  box-shadow: 0px 2px 5px 1px var(--color-grey);

  background-color: var(--color-grey);
  transition: background-color .2s;
  
  font-family: var(--font-8bit2);

  .lf-present & {
    background-color: var(--color-pink);
  }
  .lf-none & {
    height: 1rem;
    background-color: var(--color-grey);
    transition: background-color 1s, height .2s;
  }
`;

interface Props {
  reelItem?: ReelItem;
}
function ResultLabel({ reelItem }: Props) {
  const [lifecycle, setLifecycle] = useState<string>('lf-none');

  useEffect(() => {
    if (reelItem?.label) {
      setLifecycle('lf-new');
      window.setTimeout(() => {
        setLifecycle('lf-present');
      }, 1);
    } else {
      setLifecycle('lf-none');
    }
  }, [reelItem?.label]);

  return (
    <ScWrapper className={lifecycle}>
      <ScAnimator>
        <ScPill>
          <span>{reelItem?.label.toUpperCase()}</span>
        </ScPill>
        <ScPill>
          <span>{reelItem?.attributes?.join(',').toUpperCase()}</span>
        </ScPill>
      </ScAnimator>
    </ScWrapper>
  );
}

export default ResultLabel;
