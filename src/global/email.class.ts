import { ValueObject } from '@ts-typed/compiler';

/**
 * An email address, validated pragmatically rather than against the full
 * RFC 5322 grammar: `local-part@domain.tld`. The local part allows letters,
 * digits and `. _ % + -`; the domain allows letters, digits, hyphens and dots,
 * and must end in a TLD of at least two letters. This matches the format
 * checks most real-world systems apply.
 */
export class Email extends ValueObject {
  public constructor(raw: string) {
    super(raw);
  }

  protected isValid(raw: string): boolean {
    // Dot-separated atoms (no leading/trailing/consecutive dots) for the
    // local part, and hyphen-free label boundaries (no leading/trailing
    // hyphen, no consecutive dots) for the domain — the original
    // character-class-only regex accepted both.
    return /^[A-Za-z0-9_%+-]+(\.[A-Za-z0-9_%+-]+)*@([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/.test(
      raw,
    );
  }

  /** Everything before the `@`: `"ana@example.com"` -> `"ana"`. */
  public localPart(): string {
    const value = this.toString();
    return value.slice(0, value.indexOf('@'));
  }

  /** Everything after the `@`: `"ana@example.com"` -> `"example.com"`. */
  public domain(): string {
    const value = this.toString();
    return value.slice(value.indexOf('@') + 1);
  }

  /**
   * Privacy-masked display form: the first character of the local part is
   * kept, the rest of it is masked, and the domain is shown in full:
   * `"ana@example.com"` -> `"a**@example.com"`. A one-character local part
   * has nothing to mask, so it is shown as-is: `"j@example.com"`.
   */
  public redact(): string {
    const local = this.localPart();
    const masked = local.charAt(0) + '*'.repeat(Math.max(local.length - 1, 0));
    return `${masked}@${this.domain()}`;
  }
}
