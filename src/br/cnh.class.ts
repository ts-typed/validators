import { ValueObject } from '@ts-typed/compiler';

/**
 * CNH (Carteira Nacional de Habilitação): 11 digits, two modulus-11 check
 * digits.
 *
 * No `masked()` method: the CNH has no standard formatted display form, so it
 * is shown as a plain 11-digit number.
 */
export class CNH extends ValueObject {
  public constructor(raw: string) {
    super(raw);
  }

  protected isValid(raw: string): boolean {
    return isValidCNH(raw.replace(/[\s./-]/g, ''));
  }

  /** Digits only: `12345678901`. */
  public numbers(): string {
    return this.toString().replace(/[\s./-]/g, '');
  }

  /**
   * Privacy-masked form: `***154781**`. Hides the first 3 and last 2 digits,
   * showing the middle 6. The CNH has no official masking standard; this
   * applies the same proportion as `CPF.redact()` for consistency.
   */
  public redact(): string {
    const d = this.numbers();
    return `***${d.slice(3, 9)}**`;
  }
}

function isValidCNH(cleaned: string): boolean {
  if (!/^\d{11}$/.test(cleaned) || /^(\d)\1{10}/.test(cleaned)) return false;
  const digits = cleaned.split('').map(Number);
  let s1 = 0;
  let s2 = 0;
  for (let c = 0, p = 9; c < 9; c++, p--) {
    s1 += digits[c] * p;
    s2 += digits[c] * (10 - p);
  }
  const dv1raw = s1 % 11;
  const digit1 = dv1raw > 9 ? 0 : dv1raw;
  if (digits[9] !== digit1) return false;
  const dv2raw = (s2 % 11) - (dv1raw > 9 ? 2 : 0);
  const check = dv2raw < 0 ? dv2raw + 11 : (dv2raw > 9 ? 0 : dv2raw);
  return digits[10] === check;
}
