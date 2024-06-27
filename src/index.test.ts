// tests/greet.test.ts
import { greet } from './index';

test('greet function', () => {
  expect(greet('World')).toBe('Hello, World!');
});
