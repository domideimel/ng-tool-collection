export const sample = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
export const random = (lower: number, upper: number): number => Math.floor(Math.random() * (upper - lower + 1)) + lower;
export const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start }, (_, index) => start + index);
