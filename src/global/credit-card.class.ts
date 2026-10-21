import { ValueObject } from '@ts-typed/core';

/**
 * A payment card number, validated with the Luhn checksum: a network-agnostic
 * check used by card numbers worldwide. Separators (spaces or hyphens) are
 * accepted; the cleaned value must be 12 to 19 digits and pass the Luhn check.
 */
export class CreditCard extends ValueObject {
  public constructor(raw: string) {
    super(raw);
  }

  protected isValid(raw: string): boolean {
    const cleaned = raw.replace(/[\s-]/g, '');
    return /^\d{12,19}$/.test(cleaned) && isValidLuhn(cleaned);
  }

  /** Digits only, separators removed: `"4532 0151 1283 0366"` -> `"4532015112830366"`. */
  public numbers(): string {
    return this.toString().replace(/[\s-]/g, '');
  }

  /**
   * Card display form: only the last 4 digits are shown, the rest masked, in
   * groups of 4: `"4532015112830366"` -> `"**** **** **** 0366"`.
   */
  public masked(): string {
    const digits = this.numbers();
    const hidden = '*'.repeat(digits.length - 4).match(/.{1,4}/g) ?? [];
    return [...hidden, digits.slice(-4)].join(' ');
  }

  /** Card display is already a redaction by convention, so this is the same as `masked()`. */
  public redact(): string {
    return this.masked();
  }
}

function isValidLuhn(digits: string): boolean {
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}
