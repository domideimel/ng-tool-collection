import { describe, expect, it } from 'vitest';
import { random, range, sample } from './lodash.utils';

describe('Lodash Utils', () => {
  describe('sample', () => {
    it('should return an element from the array', () => {
      const array = [1, 2, 3, 4, 5];
      const result = sample(array);
      expect(array).toContain(result);
    });

    it('should handle array with single element', () => {
      const array = [1];
      expect(sample(array)).toBe(1);
    });

    it('should handle array of different types', () => {
      const array = ['a', 'b', 'c'];
      const result = sample(array);
      expect(array).toContain(result);
      expect(typeof result).toBe('string');
    });
  });

  describe('random', () => {
    it('should return number within specified range', () => {
      const lower = 1;
      const upper = 10;
      const result = random(lower, upper);

      expect(result).toBeGreaterThanOrEqual(lower);
      expect(result).toBeLessThanOrEqual(upper);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should handle same lower and upper bounds', () => {
      const value = 5;
      expect(random(value, value)).toBe(value);
    });

    it('should handle negative numbers', () => {
      const result = random(-10, -5);
      expect(result).toBeGreaterThanOrEqual(-10);
      expect(result).toBeLessThanOrEqual(-5);
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe('range', () => {
    it('should generate array with specified range', () => {
      expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
    });

    it('should handle negative numbers', () => {
      expect(range(-3, 1)).toEqual([-3, -2, -1, 0]);
    });

    it('should return empty array when start equals end', () => {
      expect(range(5, 5)).toEqual([]);
    });

    it('should handle consecutive numbers', () => {
      expect(range(1, 3)).toEqual([1, 2]);
    });
  });
});
