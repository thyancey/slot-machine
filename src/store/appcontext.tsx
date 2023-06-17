import { ReactNode, createContext, useState } from 'react';

const AppContext = createContext({} as AppContextType);
interface AppContextType {
  score: number;
  selectedItemKey: string;
  reelStates: ReelState[];
  incrementScore: Function;
  setSelectedItemKey: Function;
  setReelStates: Function;
  insertIntoReel: Function;
}

export interface ReelState {
  idx: number;
  reelItems: string[];
}

export const insertIntoArray = (positionIdx: number, itemKey: string, items: string[]) => {
  // console.log('insertIntoArray', itemKey, positionIdx, items);
  const newPos = positionIdx + 1;

  if (newPos < 0 || newPos > items.length) {
    console.error(`invalid index ${positionIdx} provided`);
    return items;
  }

  return [...items.slice(0, newPos), itemKey, ...items.slice(newPos)];
};

export const insertAfterPosition = (reelIdx: number, positionIdx: number, itemKey: string, reelStates: ReelState[]) => {
  // console.log('insertIntoReel', reelIdx, positionIdx, itemKey, reelStates);
  return reelStates.map((reelState, rIdx) => {
    if (rIdx === reelIdx) {
      return {
        idx: reelState.idx,
        reelItems: insertIntoArray(positionIdx, itemKey, reelState.reelItems),
      };
    } else {
      return reelState;
    }
  });
};

interface Props {
  children: ReactNode;
}
const AppProvider = ({ children }: Props) => {
  const [score, setScore] = useState(0);
  const [selectedItemKey, setSelectedItemKey] = useState('');
  const [reelStates, setReelStates] = useState<ReelState[]>([]);

  const incrementScore = (increment: number = 0) => {
    setScore((prevScore) => prevScore + increment);
  };

  const insertIntoReel = (reelIdx: number, insertIdx: number) => {
    //console.log('insertIntoReel', reelIdx, insertIdx, reelStates);
    const updated = insertAfterPosition(reelIdx, insertIdx, selectedItemKey, reelStates);
    setReelStates(updated);
  };

  return (
    <AppContext.Provider
      value={
        {
          score,
          selectedItemKey,
          reelStates,
          incrementScore,
          setSelectedItemKey,
          setReelStates,
          insertIntoReel,
        } as AppContextType
      }
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
