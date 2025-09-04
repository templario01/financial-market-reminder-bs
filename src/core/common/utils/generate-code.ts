import { randAlphaNumeric } from '@ngneat/falso';

export const generateRandomCode = (length: number) =>
  Array.from({ length }, () =>
    randAlphaNumeric().toString().toUpperCase(),
  ).join('');
