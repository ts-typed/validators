import { ValueObject } from '@ts-typed/compiler';

/**
 * CPF (Cadastro de Pessoas Físicas): 11 digits, two modulus-11 check digits.
 */
export class CPF extends ValueObject {
  public constructor(raw: string) {
    super(raw);
  }

  protected isValid(raw: string): boolean {
    const cleaned = raw.replace(/[\s./-]/g, '');
    return /^\d{11}$/.test(cleaned) && isValidCPF(cleaned);
  }

  /** Formatted display form: `123.456.789-01`. */
  public masked(): string {
    const d = this.numbers();
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  }

  /** Digits only: `12345678901`. */
  public numbers(): string {
    return this.toString().replace(/[\s./-]/g, '');
  }

  /**
   * Privacy-masked display form: `***.456.789-**`. Hides the first 3-digit
   * group and the two check digits, showing the middle groups. This follows a
   * convention used by at least one state's public transparency portal for
   * CPF; it is a widely used practice, not a single federal standard.
   */
  public redact(): string {
    const d = this.numbers();
    return `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**`;
  }
}

function isValidCPF(cleaned: string): boolean {
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) return false;
  const digits = cleaned.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += digits[i] * (10 - i);
  let rem = sum % 11;
  const dv1 = rem < 2 ? 0 : 11 - rem;
  if (dv1 !== digits[9]) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += digits[i] * (11 - i);
  rem = sum % 11;
  const dv2 = rem < 2 ? 0 : 11 - rem;
  return dv2 === digits[10];
}
