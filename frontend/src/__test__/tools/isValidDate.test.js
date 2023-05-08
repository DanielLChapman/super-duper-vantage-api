import { isValidDate } from '../../../tools/lib';

describe('isValidDate', () => {
  test('returns true for a valid Date object', () => {
    const input = new Date('2021-10-20');
    expect(isValidDate(input)).toBe(true);
  });

  test('returns false for an invalid Date object', () => {
    const input = new Date('invalid-date-string');
    expect(isValidDate(input)).toBe(false);
  });

  test('returns false for non-Date inputs', () => {
    const input = '2021-10-20';
    expect(isValidDate(input)).toBe(false);
  });

  test('returns false for a null input', () => {
    const input = null;
    expect(isValidDate(input)).toBe(false);
  });

  test('returns false for an undefined input', () => {
    const input = undefined;
    expect(isValidDate(input)).toBe(false);
  });
});
