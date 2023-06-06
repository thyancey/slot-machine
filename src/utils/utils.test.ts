import { describe, it, expect } from 'vitest';

import { checkUniqueStrings, checkSameStrings } from '.';

describe('utils', () => {
  describe('#checkUniqueStrings', () => {
    it('should get true for array of unique strings', () => {
      expect(checkUniqueStrings(['one','two','three'])).toBe(true);
    });
    it('should get false for array of non-unique strings', () => {
      expect(checkUniqueStrings(['one','one','three'])).toBe(false);
    });
    it('should get false for array of identical strings', () => {
      expect(checkUniqueStrings(['one','one','one'])).toBe(false);
    });
  });
  describe('#checkSameStrings', () => {
    it('should get false for array of unique strings', () => {
      expect(checkSameStrings(['one','two','three'])).toBe(false);
    });
    it('should get false for array of non-unique strings', () => {
      expect(checkSameStrings(['one','one','three'])).toBe(false);
    });
    it('should get true for array of identical strings', () => {
      expect(checkSameStrings(['one','one','one'])).toBe(true);
    });
  });
});