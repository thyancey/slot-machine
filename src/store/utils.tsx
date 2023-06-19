export type ReelState = string[];

export const insertReelStateIntoReelStates = (positionIdx: number, newReelState: ReelState, reelStates: ReelState[]) => {
  const newPos = positionIdx + 1;

  if (newPos < 0 || newPos > reelStates.length) {
    console.error(`invalid index ${positionIdx} provided`);
    return reelStates;
  }

  return [...reelStates.slice(0, newPos), newReelState, ...reelStates.slice(newPos)];
};

export const insertIntoArray = (positionIdx: number, newItem: string, array: ReelState) => {
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
