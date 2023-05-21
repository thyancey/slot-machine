import { describe, it, expect } from 'vitest'
import { buildReel } from './reel';

describe('slotmachine > reel', () => {
  describe('#buildReel', () => {
    it('should keep reelItems the same when no reelOverlap provided', () => {
      expect(buildReel(['A', 'B', 'C'], 0)).toEqual(
        ['A', 'B', 'C']
      );
    });

    it('should keep previx items before/after reel', () => {
      expect(buildReel(['A', 'B', 'C'], 2)).toEqual(
        [
          'B', 'C',
          'A', 'B', 'C',
          'A', 'B'
        ]
      );
    });

    it('should handle repeat longer than array', () => {
      expect(buildReel(['A', 'B'], 3)).toEqual(
        [
          'B', 'A', 'B',
          'A', 'B',
          'A', 'B', 'A'
        ]
      );
    });

    it('should handle repeat for a single item', () => {
      expect(buildReel(['A'], 3)).toEqual(
        [
          'A', 'A', 'A',
          'A',
          'A', 'A', 'A'
        ]
      );
    });
  })
});