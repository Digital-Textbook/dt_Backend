export function isBhutanesePhoneNumber(phoneNumber: string): boolean {
  const bhutanesePhonePattern = /^\+975(17|77)\d{6}$/;
  return bhutanesePhonePattern.test(phoneNumber);
}
