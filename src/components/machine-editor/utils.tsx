import { DeckState } from '../../store/data';
import { clamp } from '../../utils';

/**
 * Pull cards from the top of the deck. If there is no more draw pile, refill it from the discard. Do not
 */
export const drawTile = (deckState: DeckState, noRefill?: boolean) => {
  if (deckState.draw.length === 0) {
    if (noRefill || deckState.discard.length === 0) {
      console.log('!! no more cards!');
      // well apparently theres no cards left, so just give back what you had
      return deckState;
    }

    // refill / shuffle the deck
    const shuffledDraw = deckState.discard.sort(() => Math.random() - 0.5);
    deckState.draw = shuffledDraw;
    deckState.discard = [];
  }

  return {
    drawn: [...deckState.drawn, deckState.draw[deckState.draw.length - 1]],
    draw: deckState.draw.slice(0, -1),
    discard: deckState.discard,
  };
};

export const drawTiles = (numToDraw: number, deckState: DeckState) => {
  const availableToDraw = clamp(numToDraw, 1, deckState.draw.length + deckState.discard.length);
  const operations = Array.from(Array(availableToDraw).keys());

  return operations.reduce((acc, _) => {
    return drawTile(acc);
  }, deckState);
};

export const discardTiles = (discardIdxs: number[], deckState: DeckState) => {
  return {
    drawn: deckState.drawn.filter((tileIdx) => !discardIdxs.includes(tileIdx)),
    draw: deckState.draw,
    discard: [...deckState.discard, ...discardIdxs],
  };
};