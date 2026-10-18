import { ValueObject } from '@ts-typed/compiler';

/**
 * PIS / PASEP / NIS / NIT: the same 11-digit number and check digit, issued
 * under different names depending on the employer or program. `Pasep`, `Nis`
 * and `Nit` are aliases of this class, exported for readability.
 */
export class PIS extends ValueObject {
  public constructor(raw: string) {
    super(raw);
  }

  protected isValid(raw: string): boolean {
    return isValidPIS(raw.replace(/[\s./-]/g, ''));
  }

  /** Formatted display form: `120.65328.70-5`. */
  public masked(): string {
    const d = this.numbers();
    return `${d.slice(0, 3)}.${d.slice(3, 8)}.${d.slice(8, 10)}-${d.slice(10)}`;
  }

  /** Digits only: `12065328705`. */
  public numbers(): string {
    return this.toString().replace(/[\s./-]/g, '');
  }
}

export { PIS as Pasep, PIS as Nis, PIS as Nit };

function isValidPIS(cleaned: string): boolean {
  if (!/^\d{11}$/.test(cleaned) || /^(\d)\1{10}$/.test(cleaned)) return false;
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const digits = cleaned.split('').map(Number);
  const sum = weights.reduce((acc, w, i) => acc + w * digits[i], 0);
  let dv = 11 - (sum % 11);
  if (dv >= 10) dv = 0;
  return dv === digits[10];
}
