import { ValueObject } from '@ts-typed/core';

/**
 * CNPJ (Cadastro Nacional da Pessoa Jurídica).
 *
 * Accepts both the legacy all-numeric 14-digit format and the alphanumeric
 * format introduced in July 2026, where the first 12 characters may be `0-9`
 * or `A-Z`. Both use the same check-digit algorithm: a character's value is
 * `charCode - 48`, so `'0'-'9'` map to 0-9 and `'A'-'Z'` map to 17-42.
 *
 * `numbers()` returns the normalized (uppercased, unformatted) 14-character
 * value, which may contain letters for the alphanumeric format.
 */
export class CNPJ extends ValueObject {
  public constructor(raw: string) {
    super(raw);
  }

  protected isValid(raw: string): boolean {
    return isValidCNPJ(normalize(raw));
  }

  /** Formatted display form: `12.ABC.345/01DE-35` (or `11.222.333/0001-81`). */
  public masked(): string {
    const v = this.numbers();
    return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8, 12)}-${v.slice(12)}`;
  }

  /** Normalized unformatted value, uppercased: `12ABC34501DE35`. */
  public numbers(): string {
    return normalize(this.toString());
  }

  /**
   * Privacy-masked display form: `**.ABC.345/01DE-**`. Hides the first
   * 2-character group and the final 2 check digits.
   *
   * CNPJ identifies a LEGAL ENTITY (a company), not a natural person. LGPD's
   * personal-data protections apply to pessoa física, so redacting a CNPJ is
   * not a legal requirement the way it is for CPF. This method exists for API
   * consistency with the other document classes, not because CNPJ redaction is
   * commonly practiced or required. The masking pattern follows the same
   * principle as `CPF.redact()`; it is not a CNPJ-specific federal standard.
   */
  public redact(): string {
    const v = this.numbers();
    return `**.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8, 12)}-**`;
  }
}

function normalize(raw: string): string {
  return raw.replace(/[\s./-]/g, '').toUpperCase();
}

function charValue(ch: string): number {
  return ch.charCodeAt(0) - 48; // '0'-'9' -> 0-9, 'A'-'Z' -> 17-42
}

function calcDV(values: number[], weights: number[]): number {
  const sum = values.reduce((acc, v, i) => acc + v * weights[i], 0);
  const rem = sum % 11;
  return rem < 2 ? 0 : 11 - rem;
}

function isValidCNPJ(cleanedUpper: string): boolean {
  if (cleanedUpper.length !== 14) return false;
  if (!/^[0-9A-Z]{12}[0-9]{2}$/.test(cleanedUpper)) return false;
  if (/^(.)\1{13}$/.test(cleanedUpper)) return false;
  const values = cleanedUpper.slice(0, 12).split('').map(charValue);
  const checkDigits = cleanedUpper.slice(12).split('').map(Number);
  const dv1Weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const dv1 = calcDV(values, dv1Weights);
  if (dv1 !== checkDigits[0]) return false;
  const dv2Weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const dv2 = calcDV([...values, dv1], dv2Weights);
  return dv2 === checkDigits[1];
}
