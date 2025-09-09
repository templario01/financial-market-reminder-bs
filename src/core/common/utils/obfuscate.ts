export const obfuscateEmail = (email: string): string => {
  const parts = email.split('@');
  const localPart = parts[0];
  const domain = parts[1];

  let obfuscatedLocalPart: string;

  if (localPart.length <= 2) {
    obfuscatedLocalPart = localPart;
  } else {
    obfuscatedLocalPart = `${localPart.slice(0, 2)}**`;
  }

  return domain ? `${obfuscatedLocalPart}@${domain}` : obfuscatedLocalPart;
};
