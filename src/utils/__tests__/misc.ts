import {formatDate} from '../misc';

test('formatDate formats the date to look nice', () => {
  expect(formatDate(new Date(`December 25, 1945`))).toBe(`Dec 45`);
});
