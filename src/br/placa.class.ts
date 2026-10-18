import { ValueObject } from '@ts-typed/compiler';

const LEGACY = /^[A-Z]{3}\d{4}$/;
const MERCOSUL = /^[A-Z]{3}\d[A-Z]\d{2}$/;

/**
 * Brazilian vehicle license plate (placa).
 *
 * Accepts both the legacy format (`ABC1234`, displayed `ABC-1234`) and the
 * Mercosul format (`ABC1D23`, displayed without a separator).
 *
 * Format validation only: a vehicle plate has no checksum, so only the shape
 * is checked.
 */
export class Placa extends ValueObject {
  public constructor(raw: string) {
    super(raw);
  }

  protected isValid(raw: string): boolean {
    const cleaned = normalize(raw);
    return LEGACY.test(cleaned) || MERCOSUL.test(cleaned);
  }

  /** Formatted display form: `ABC-1234` (legacy) or `ABC1D23` (Mercosul). */
  public masked(): string {
    const v = this.numbers();
    return LEGACY.test(v) ? `${v.slice(0, 3)}-${v.slice(3)}` : v;
  }

  /** Normalized uppercase value without separators: `ABC1234` or `ABC1D23`. */
  public numbers(): string {
    return normalize(this.toString());
  }

  /**
   * Privacy-masked form: `ABC****` for either format (legacy or Mercosul),
   * with no separator. Shows the 3-letter prefix and masks the rest. This is a
   * reasonable, consistent masking convention chosen for this library; it is
   * not an official plate-specific standard.
   */
  public redact(): string {
    return `${this.numbers().slice(0, 3)}****`;
  }
}

function normalize(raw: string): string {
  return raw.replace(/[\s./-]/g, '').toUpperCase();
}
