import formatAmounts from '../../../tools/convertAmounts';

describe('formats', () => {
  test('correctly converts the money from pennies to dollars', () => {
    const input = 100000;
    const expectedOutput = '$1,000';
    expect(formatAmounts(input)).toBe(expectedOutput);
  });

  test('correctly converts the money from pennies to dollars', () => {
    const input = 100052;
    const expectedOutput = '$1,000.52';
    expect(formatAmounts(input)).toBe(expectedOutput);
  });

  test('returns if its a string', () => {
    const input = 'World';
    const expectedOutput = 'World';
    expect(formatAmounts(input)).toBe(expectedOutput);
  });

  test('handles already established decimals', () => {
    const input = 100.00;
    const expectedOutput = '$1';
    expect(formatAmounts(input)).toBe(expectedOutput);
  });

});
