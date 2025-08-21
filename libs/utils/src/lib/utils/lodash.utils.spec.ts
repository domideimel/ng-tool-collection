import { describe, expect, it } from 'vitest';
import { random, range, sample } from './lodash.utils';

describe('lodash.utils', () => {
  describe('range', () => {
    it('creates an empty array when start === end', () => {
      expect(range(5, 5)).toEqual([]);
    });

    it('creates a sequence from start to end-1', () => {
      expect(range(0, 3)).toEqual([0, 1, 2]);
      expect(range(2, 5)).toEqual([2, 3, 4]);
    });
  });

  describe('random', () => {
    it('returns values within inclusive bounds', () => {
      for (let i = 0; i < 100; i++) {
        const n = random(1, 3);
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(3);
      }
    });

    it('returns the bound when lower === upper', () => {
      expect(random(7, 7)).toBe(7);
    });
  });

  describe('sample', () => {
    it('returns an element from the array', () => {
      const arr = ['a', 'b', 'c'];
      for (let i = 0; i < 20; i++) {
        expect(arr).toContain(sample(arr));
      }
    });

    it('works with single-element arrays', () => {
      expect(sample([42])).toBe(42);
    });
  });
});
