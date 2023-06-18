import { describe, it, expect } from 'vitest';

import { insertAfterPosition, insertIntoArray, removeAtPosition } from './appcontext';

describe('AppContext', () => {
  describe('#insertIntoArray', () => {
    const items = ['apple', 'banana', 'carrot'];

    it('should insert before reel', () => {
      const result = insertIntoArray(-1, 'NEW', items);
      expect(result.length).toBe(4);
      expect(result).toEqual(['NEW', 'apple', 'banana', 'carrot']);
    });

    it('should insert after first position', () => {
      const result = insertIntoArray(0, 'NEW', items);
      expect(result.length).toBe(4);
      expect(result).toEqual(['apple', 'NEW', 'banana', 'carrot']);
    });

    it('should insert after last position', () => {
      const result = insertIntoArray(2, 'NEW', items);
      expect(result.length).toBe(4);
      expect(result).toEqual(['apple', 'banana', 'carrot', 'NEW']);
    });

    it('should insert duplicate after first position', () => {
      const result = insertIntoArray(0, 'apple', items);
      expect(result.length).toBe(4);
      expect(result).toEqual(['apple', 'apple', 'banana', 'carrot']);
    });

    it('should not change input if index is under bounded', () => {
      const result = insertIntoArray(-2, 'NEW', items);
      expect(result.length).toBe(3);
      expect(result).toEqual(['apple', 'banana', 'carrot']);
    });

    it('should not change input if index is over bounded', () => {
      const result = insertIntoArray(3, 'NEW', items);
      expect(result.length).toBe(3);
      expect(result).toEqual(['apple', 'banana', 'carrot']);
    });
  });

  
  describe('#insertAfterPosition', () => {
    const reelStates = [
      {
        items: ['apple', 'banana', 'carrot']
      },
      {
        items: ['apple', 'banana', 'carrot']
      }
    ];

    it('should insert before first reel', () => {
      const result = insertAfterPosition(0, -1, 'NEW', reelStates);
      expect(result).toEqual([
        {
          items: ['NEW', 'apple', 'banana', 'carrot']
        },
        {
          items: ['apple', 'banana', 'carrot']
        }
      ]);
    });

    it('should insert after last reel', () => {
      const result = insertAfterPosition(1, 2, 'NEW', reelStates);
      expect(result).toEqual([
        {
          items: ['apple', 'banana', 'carrot']
        },
        {
          items: ['apple', 'banana', 'carrot', 'NEW']
        }
      ]);
    });

    it('should return same if bad reel index provided', () => {
      const result = insertAfterPosition(10, 2, 'NEW', reelStates);
      expect(result).toEqual([
        {
          items: ['apple', 'banana', 'carrot']
        },
        {
          items: ['apple', 'banana', 'carrot']
        }
      ]);
    });
  });
  
  
  describe('#removeAtPosition', () => {
    const reelStates = [
      {
        items: ['apple', 'banana', 'carrot']
      },
      {
        items: ['apple', 'banana', 'carrot']
      }
    ];

    it('should remove first value in first reel', () => {
      const result = removeAtPosition(0, 0, reelStates);
      expect(result).toEqual([
        {
          items: ['banana', 'carrot']
        },
        {
          items: ['apple', 'banana', 'carrot']
        }
      ]);
    });

    it('should remove second value in second reel', () => {
      const result = removeAtPosition(1, 1, reelStates);
      expect(result).toEqual([
        {
          items: ['apple', 'banana', 'carrot']
        },
        {
          items: ['apple', 'carrot']
        }
      ]);
    });

    it('should remove last value in first reel', () => {
      const result = removeAtPosition(0, 2, reelStates);
      expect(result).toEqual([
        {
          items: ['apple', 'banana']
        },
        {
          items: ['apple', 'banana', 'carrot']
        }
      ]);
    });

    it('should not break, if invalid position given', () => {
      const result = removeAtPosition(0, 4, reelStates);
      expect(result).toEqual([
        {
          items: ['apple', 'banana', 'carrot']
        },
        {
          items: ['apple', 'banana', 'carrot']
        }
      ]);
    });

    it('should remove reel after clearing out all items', () => {
      const theseReelStates = [
        {
          items: ['apple']
        },
        {
          items: ['banana', 'carrot']
        }
      ];

      const result = removeAtPosition(0, 0, theseReelStates);
      expect(result).toEqual([
        {
          items: ['banana', 'carrot']
        }
      ]);
    });

    it('should not remove last remaining reel and item', () => {
      const theseReelStates = [
        {
          items: ['apple']
        }
      ];

      const result = removeAtPosition(0, 0, theseReelStates);
      expect(result).toEqual([
        {
          items: ['apple']
        }
      ]);
    });
  });
});
