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
  removeFromReel: Function;
}

export interface ReelState {
  items: string[];
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
        items: insertIntoArray(positionIdx, itemKey, reelState.items),
      };
    } else {
      return reelState;
    }
  });
};

export const removeAtPosition = (reelIdx: number, positionIdx: number, reelStates: ReelState[]) => {
  return reelStates.map((reelState, rIdx) => {
    if(rIdx === reelIdx){
      return {
        items: reelState.items.filter((_, index) => index !== positionIdx)
      }
    } else {
      return reelState;
    }
  });
}

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

  const insertIntoReel = (reelIdx: number, positionIdx: number) => {
    //console.log('insertIntoReel', reelIdx, positionIdx, reelStates);
    setReelStates(insertAfterPosition(reelIdx, positionIdx, selectedItemKey, reelStates));
  };

  const removeFromReel = (reelIdx: number, positionIdx: number) => {
    console.log('removeFromReel', reelIdx, positionIdx, reelStates);
    setReelStates(removeAtPosition(reelIdx, positionIdx, reelStates));
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
          removeFromReel,
        } as AppContextType
      }
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
