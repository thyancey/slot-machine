import { DeckIdxCollection, TileKeyCollection, tileGlossary } from './data';

export const insertReelStateIntoReelStates = (
  positionIdx: number,
  newReelState: DeckIdxCollection,
  reelStates: DeckIdxCollection[]
) => {
  const newPos = positionIdx + 1;

  if (newPos < 0 || newPos > reelStates.length) {
    console.error(`invalid index ${positionIdx} provided`);
    return reelStates;
  }

  return [...reelStates.slice(0, newPos), newReelState, ...reelStates.slice(newPos)];
};

export const insertIntoArray = (positionIdx: number, newItem: number, array: DeckIdxCollection) => {
  const newPos = positionIdx + 1;

  if (newPos < 0 || newPos > array.length) {
    console.error(`invalid index ${positionIdx} provided`);
    return array;
  }

  return [...array.slice(0, newPos), newItem, ...array.slice(newPos)];
};

export const insertAfterPosition = (
  reelIdx: number,
  positionIdx: number,
  deckIdx: number,
  reelStates: DeckIdxCollection[]
) => {
  return reelStates.map((reelState, rIdx) => {
    if (rIdx === reelIdx) {
      return insertIntoArray(positionIdx, deckIdx, reelState);
    } else {
      return reelState;
    }
  });
};

export const removeAtPosition = (reelIdx: number, positionIdx: number, reelStates: DeckIdxCollection[]) => {
  if (reelStates.length === 1 && reelStates[0].length === 1) {
    console.log('ARE YOU CRAZY?!?! YOU CANT HAVE NOTHING!!!!!');
    return reelStates;
  }

  return reelStates
    .map((reelState, rIdx) => {
      if (rIdx === reelIdx) {
        return reelState.filter((_, index) => index !== positionIdx);
      } else {
        return reelState;
      }
    })
    .filter((rs) => rs.length > 0);
};

export const getReelTileStatesFromReelStates = (reelStates: DeckIdxCollection[], tileDeck: TileKeyCollection) => {
  return reelStates.map((reelState) => reelState.map((deckIdx) => tileGlossary[tileDeck[deckIdx]]));
};

export const getReelTileStateFromReelState = (reelState: DeckIdxCollection, tileDeck: TileKeyCollection) => {
  return reelState.map((deckIdx) => tileGlossary[tileDeck[deckIdx]]);
};

export const getTileFromDeckIdx = (deckIdx: number, tileDeck: TileKeyCollection) => {
  return tileGlossary[tileDeck[deckIdx]];
};