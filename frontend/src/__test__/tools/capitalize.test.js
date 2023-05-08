import { capitalize } from '../../../tools/capitalize';

describe('capitalize', () => {
  test('capitalizes the first letter of a lowercase string', () => {
    const input = 'hello';
    const expectedOutput = 'Hello';
    expect(capitalize(input)).toBe(expectedOutput);
  });

  test('does not change the first letter of an already capitalized string', () => {
    const input = 'World';
    const expectedOutput = 'World';
    expect(capitalize(input)).toBe(expectedOutput);
  });

  test('capitalizes a single lowercase letter', () => {
    const input = 'a';
    const expectedOutput = 'A';
    expect(capitalize(input)).toBe(expectedOutput);
  });

  test('does not change a single uppercase letter', () => {
    const input = 'B';
    const expectedOutput = 'B';
    expect(capitalize(input)).toBe(expectedOutput);
  });

  test('does not change an empty string', () => {
    const input = '';
    const expectedOutput = '';
    expect(capitalize(input)).toBe(expectedOutput);
  });

  test('capitalizes the first letter and keeps the rest unchanged', () => {
    const input = 'capitalize this String';
    const expectedOutput = 'Capitalize this String';
    expect(capitalize(input)).toBe(expectedOutput);
  });

  test('handles strings with special characters', () => {
    const input = '!hello world';
    const expectedOutput = '!hello world';
    expect(capitalize(input)).toBe(expectedOutput);
  });

  test('handles strings with numbers', () => {
    const input = '123hello';
    const expectedOutput = '123hello';
    expect(capitalize(input)).toBe(expectedOutput);
  });
});
