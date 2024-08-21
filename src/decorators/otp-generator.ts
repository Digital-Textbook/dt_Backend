import { randomInt } from 'crypto';

function generateOtp(): string {
  return randomInt(100000, 999999).toString();
}
