import { obfuscateEmail } from './obfuscate';

describe('obfuscateEmail', () => {
  it('should obfuscate email with local part longer than 2 characters', () => {
    const email = 'test@example.com';
    const obfuscated = obfuscateEmail(email);
    expect(obfuscated).toBe('te**@example.com');
  });
});
