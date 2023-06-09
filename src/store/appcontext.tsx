import { ReactNode, createContext, useCallback, useState } from 'react';
import {
  DeckState,
  MAX_REELS,
  INITIAL_TOKENS,
  MAX_REEL_TOKENS,
  UiState,
  TileKeyCollection,
  DeckIdxCollection,
} from './data';
import { clamp } from '../utils';
import { insertAfterPosition, insertReelStateIntoReelStates, removeAtPosition } from './utils';
import { discardTiles, drawTiles } from '../components/machine-editor/utils';

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

  reelStates: DeckIdxCollection[];
  setReelStates: (values: DeckIdxCollection[]) => void;

  upgradeTokens: number;
  setUpgradeTokens: (value: number) => void;

  uiState: UiState;
  setUiState: (value: UiState) => void;

  insertIntoReel: (reelIdx: number, positionIdx: number) => void;
  removeFromReel: (reelIdx: number, positionIdx: number) => void;
  insertReel: (positionIdx: number) => void;

  drawCards: (numToDraw: number) => void;
  discardCards: (ignoreIdx: number) => void;
}

interface Props {
  children: ReactNode;
}
const AppProvider = ({ children }: Props) => {
  const [score, setScore] = useState(0);
  const [uiState, setUiState] = useState<UiState>('game');
  const [upgradeTokens, setUpgradeTokensState] = useState(INITIAL_TOKENS);
  const [selectedTileIdx, setSelectedTileIdx] = useState(-1);
  const [reelStates, setReelStates] = useState<DeckIdxCollection[]>([]);
  const [tileDeck, setTileDeck] = useState<TileKeyCollection>([]);
  const [deckState, setDeckState] = useState<DeckState>({
    drawn: [],
    draw: [],
    discard: [],
  });

  const incrementScore = useCallback(
    (increment = 0) => {
      setScore((prevScore) => Math.floor(prevScore + increment));
    },
    [setScore]
  );

  // TODO - these should probably use useCallback, but it wasnt necessary when i first
  // put them in here.
  const insertIntoReel = (reelIdx: number, positionIdx: number) => {
    setReelStates(insertAfterPosition(reelIdx, positionIdx, selectedTileIdx, reelStates));
  };

  const removeFromReel = (reelIdx: number, positionIdx: number) => {
    const afterRemove = removeAtPosition(reelIdx, positionIdx, reelStates);
    console.log('afterRemove', afterRemove)
    setReelStates(afterRemove);
  };

  const insertReel = (positionIdx: number) => {
    if (reelStates.length < MAX_REELS) {
      console.log('3');
      setReelStates(insertReelStateIntoReelStates(positionIdx, [selectedTileIdx], reelStates));
    } else {
      console.log(`cannot add more than ${MAX_REELS} reels!`);
    }
  };

  const drawCards = useCallback(
    (numToDraw: number) => {
      console.log(`AppContext.drawCards(${numToDraw})`);
      const afterState = drawTiles(numToDraw, deckState);
      console.log('afterState:', afterState);

      setDeckState(afterState);
    },
    [deckState]
  );

  const discardCards = useCallback(
    (_: number) => {
      setDeckState(discardTiles(deckState.drawn, deckState));
    },
    [deckState]
  );

  const setUpgradeTokens = (newAmount: number) => {
    setUpgradeTokensState(clamp(newAmount, 0, MAX_REEL_TOKENS));
  };

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
          setDeckState,

          drawCards,
          discardCards,
        } as AppContextType
      }
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
