import { ReactNode, createContext, useState } from 'react';
import { DeckState, MAX_REELS, TileKeyCollection } from './data';
import { clamp } from '../utils';

const AppContext = createContext({} as AppContextType);
interface AppContextType {
  score: number;
  incrementScore: (increment: number) => void;

  selectedTileIdx: number;
  setSelectedTileIdx: (idx: number) => void;

  tileDeck: TileKeyCollection;
  setTileDeck: (value: TileKeyCollection) => void;
  
  deckState: DeckState;
  setDeckState: (value: DeckState) => void;

  reelStates: ReelState[];
  setReelStates: (values: ReelState[]) => void;

  upgradeTokens: number;
  setUpgradeTokens: (value: number) => void;

  uiState: UiState;
  setUiState: (value: UiState) => void;

  insertIntoReel: (reelIdx: number, positionIdx: number) => void;
  removeFromReel: (reelIdx: number, positionIdx: number) => void;
  insertReel: (positionIdx: number) => void;
}

export type ReelState = string[];

export const insertIntoArray = (positionIdx: number, newItem: any, array: any[]) => {
  const newPos = positionIdx + 1;

  if (newPos < 0 || newPos > array.length) {
    console.error(`invalid index ${positionIdx} provided`);
    return array;
  }

  return [...array.slice(0, newPos), newItem, ...array.slice(newPos)];
};

export const insertAfterPosition = (reelIdx: number, positionIdx: number, tileKey: string, reelStates: ReelState[]) => {
  return reelStates.map((reelState, rIdx) => {
    if (rIdx === reelIdx) {
      return insertIntoArray(positionIdx, tileKey, reelState);
    } else {
      return reelState;
    }
  });
};

export const removeAtPosition = (reelIdx: number, positionIdx: number, reelStates: ReelState[]) => {
  if(reelStates.length === 1 && reelStates[0].length === 1){
    console.log('ARE YOU CRAZY?!?! YOU CANT HAVE NOTHING!!!!!');
    return reelStates;
  }

  return reelStates.map((reelState, rIdx) => {
    if(rIdx === reelIdx){
      return reelState.filter((_, index) => index !== positionIdx);
    } else {
      return reelState;
    }
  }).filter(rs => rs.length > 0);
}

export const INITIAL_TOKENS = 2;
export const MAX_REEL_TOKENS = 5;

export type UiState = 'game' | 'editor';
interface Props {
  children: ReactNode;
}
const AppProvider = ({ children }: Props) => {
  const [score, setScore] = useState(0);
  const [uiState, setUiState] = useState<UiState>('game');
  const [upgradeTokens, setUpgradeTokensState] = useState(INITIAL_TOKENS);
  const [selectedTileIdx, setSelectedTileIdx] = useState(-1);
  const [reelStates, setReelStates] = useState<ReelState[]>([]);
  const [tileDeck, setTileDeck] = useState<TileKeyCollection>([]);
  const [deckState, setDeckState] = useState<DeckState>({
    drawn: [], draw: [], discard: []
  });

  const incrementScore = (increment = 0) => {
    setScore((prevScore) => prevScore + increment);
  };

  const insertIntoReel = (reelIdx: number, positionIdx: number) => {
    const selectedTileKey = tileDeck[selectedTileIdx];
    setReelStates(insertAfterPosition(reelIdx, positionIdx, selectedTileKey, reelStates));
  };

  const removeFromReel = (reelIdx: number, positionIdx: number) => {
    setReelStates(removeAtPosition(reelIdx, positionIdx, reelStates));
  };

  const insertReel = (positionIdx: number) => {
    if(reelStates.length < MAX_REELS){
      const selectedTileKey = tileDeck[selectedTileIdx];
      setReelStates(insertIntoArray(positionIdx, [ selectedTileKey ], reelStates));
    } else {
      console.log(`cannot add more than ${MAX_REELS} reels!`);
    }
  };

  const setUpgradeTokens = (newAmount: number) => {
    setUpgradeTokensState(clamp(newAmount, 0, MAX_REEL_TOKENS));
  }

  /*
  const drawCard = () => {
    if(deckState.draw.length > 0){
      const idx = deckState.draw[deckState.draw.length - 1];
      setDeckState({
        draw: deckState.draw.slice(0, -1),
        discard: deckState.discard
      });
      return idx;
    } else{
      // refill / shuffle the deck
      const shuffledIdxs = Array.from(Array(tileDeck.length).keys()).sort(() => Math.random() - 0.5);
      const idx = shuffledIdxs[shuffledIdxs.length - 1];
      setDeckState({
        draw: shuffledIdxs.slice(0, -1),
        discard: []
      });
      return idx;
    }
  }
  */

  return (
    <AppContext.Provider
      value={
        {
          score,
          incrementScore,

          selectedTileIdx,
          setSelectedTileIdx,

          reelStates,
          setReelStates,

          upgradeTokens,
          setUpgradeTokens,

          uiState,
          setUiState,
          
          insertIntoReel,
          removeFromReel,
          insertReel,

          tileDeck,
          setTileDeck,

          deckState,
          setDeckState
        } as AppContextType
      }
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
