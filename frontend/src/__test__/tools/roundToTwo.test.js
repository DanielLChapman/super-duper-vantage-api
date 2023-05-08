import roundToTwo from '../../../tools/roundToTwo';

describe('roundToTwo', () => {
  test('rounds a number to two decimal places', () => {
    const input = 123.4567;
    const expectedOutput = 123.46;
    expect(roundToTwo(input)).toBe(expectedOutput);
  });

  test('rounds a number with less than two decimal places correctly', () => {
    const input = 7.5;
    const expectedOutput = 7.5;
    expect(roundToTwo(input)).toBe(expectedOutput);
  });

  test('rounds a whole number correctly', () => {
    const input = 42;
    const expectedOutput = 42;
    expect(roundToTwo(input)).toBe(expectedOutput);
  });

  test('handles negative numbers correctly', () => {
    const input = -123.4567;
    const expectedOutput = -123.46;
    expect(roundToTwo(input)).toBe(expectedOutput);
  });
});
