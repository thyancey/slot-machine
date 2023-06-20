import { describe, it, expect } from 'vitest';
import { insertAfterPosition, insertIntoArray, removeAtPosition } from './utils';


describe('AppContext', () => {
  describe('#insertIntoArray', () => {
    const items = [0, 1, 2];

    it('should insert before reel', () => {
      const result = insertIntoArray(-1, 9999, items);
      expect(result.length).toBe(4);
      expect(result).toEqual([9999, 0, 1, 2]);
    });

    it('should insert after first position', () => {
      const result = insertIntoArray(0, 9999, items);
      expect(result.length).toBe(4);
      expect(result).toEqual([0, 9999, 1, 2]);
    });

    it('should insert after last position', () => {
      const result = insertIntoArray(2, 9999, items);
      expect(result.length).toBe(4);
      expect(result).toEqual([0, 1, 2, 9999]);
    });

    it('should insert duplicate after first position', () => {
      const result = insertIntoArray(0, 0, items);
      expect(result.length).toBe(4);
      expect(result).toEqual([0, 0, 1, 2]);
    });

    it('should not change input if index is under bounded', () => {
      const result = insertIntoArray(-2, 9999, items);
      expect(result.length).toBe(3);
      expect(result).toEqual([0, 1, 2]);
    });

    it('should not change input if index is over bounded', () => {
      const result = insertIntoArray(3, 9999, items);
      expect(result.length).toBe(3);
      expect(result).toEqual([0, 1, 2]);
    });
  });

  
  describe('#insertAfterPosition', () => {
    const reelStates = [
      [0, 1, 2],
      [0, 1, 2]
    ];

    it('should insert before first reel', () => {
      const result = insertAfterPosition(0, -1, 99999, reelStates);
      expect(result).toEqual([
        [99999, 0, 1, 2],
        [0, 1, 2]
      ]);
    });

    it('should insert after last reel', () => {
      const result = insertAfterPosition(1, 2, 99999, reelStates);
      expect(result).toEqual([
        [0, 1, 2],
        [0, 1, 2, 99999]
      ]);
    });

    it('should return same if bad reel index provided', () => {
      const result = insertAfterPosition(10, 2, 99999, reelStates);
      expect(result).toEqual([
        [0, 1, 2],
        [0, 1, 2]
      ]);
    });
  });
  
  
  describe('#removeAtPosition', () => {
    const reelStates = [
      [0, 1, 2],
      [0, 1, 2]
    ];

    it('should remove first value in first reel', () => {
      const result = removeAtPosition(0, 0, reelStates);
      expect(result).toEqual([
        [1, 2],
        [0, 1, 2]
      ]);
    });

    it('should remove second value in second reel', () => {
      const result = removeAtPosition(1, 1, reelStates);
      expect(result).toEqual([
        [0, 1, 2],
        [0, 2]
      ]);
    });

    it('should remove last value in first reel', () => {
      const result = removeAtPosition(0, 2, reelStates);
      expect(result).toEqual([
        [0, 1],
        [0, 1, 2]
      ]);
    });

    it('should not break, if invalid position given', () => {
      const result = removeAtPosition(0, 4, reelStates);
      expect(result).toEqual([
        [0, 1, 2],
        [0, 1, 2]
      ]);
    });

    it('should remove reel after clearing out all items', () => {
      const theseReelStates = [
        [0],
        [1, 2]
      ];

      const result = removeAtPosition(0, 0, theseReelStates);
      expect(result).toEqual([
        [1, 2]
      ]);
    });

    it('should not remove last remaining reel and tile', () => {
      const theseReelStates = [
        [0]
      ];

      const result = removeAtPosition(0, 0, theseReelStates);
      expect(result).toEqual([
        [0]
      ]);
    });
  });
});
