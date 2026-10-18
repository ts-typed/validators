import { ValueObject } from '@ts-typed/compiler';

/**
 * CEP (Código de Endereçamento Postal).
 *
 * Format validation only: a CEP has no check digit, so this checks that the
 * value is exactly 8 digits after formatting characters are removed.
 */
export class CEP extends ValueObject {
  public constructor(raw: string) {
    super(raw);
  }

  protected isValid(raw: string): boolean {
    return /^\d{8}$/.test(raw.replace(/[\s./-]/g, ''));
  }

  /** Formatted display form: `12345-678`. */
  public masked(): string {
    const d = this.numbers();
    return `${d.slice(0, 5)}-${d.slice(5)}`;
  }

  /** Digits only: `12345678`. */
  public numbers(): string {
    return this.toString().replace(/[\s./-]/g, '');
  }

  /**
   * Hides the first 5 digits (the part that narrows a location down to a
   * specific area/sector) and shows only the last 3 (the distribution
   * digits): `"12345-678"` -> `"*****-678"`.
   */
  public redact(): string {
    const d = this.numbers();
    return `*****-${d.slice(5)}`;
  }
}
