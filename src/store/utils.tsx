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
