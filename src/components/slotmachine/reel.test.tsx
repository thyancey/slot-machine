import { describe, it, expect } from 'vitest'
import { buildReel, projectSpinTarget } from './reel';

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
  });

  // TODO: something wrong with wrapped spins
  describe('#projectSpinTarget', () => {
    // numItems, curIdx, next, numLoops
    it('should return index for same loop', () => {
      expect(projectSpinTarget(2, 0, 0, 0)).toBe(2);
      expect(projectSpinTarget(2, 0, 1, 0)).toBe(1);
    })
    it('should return index for next loop', () => {
      expect(projectSpinTarget(2, 0, 0, 1)).toBe(2);
      expect(projectSpinTarget(2, 0, 1, 1)).toBe(3);
    })
    it('should return index for next, next loop', () => {
      expect(projectSpinTarget(2, 0, 0, 2)).toBe(4);
      expect(projectSpinTarget(2, 0, 1, 2)).toBe(5);
    })
    it('should return index for a loop, from offset', () => {
      expect(projectSpinTarget(2, 0, 1, 0)).toBe(1)
    })
    it('should not do this bug', () => {
      expect(projectSpinTarget(4, 2, 0, 1)).toBe(8)
    })
    it('should not do this other bug', () => {
      expect(projectSpinTarget(4, 1, 3, 1)).toBe(7)
    })
  });
});