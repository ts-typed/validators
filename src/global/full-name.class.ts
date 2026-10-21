import { ValueObject } from '@ts-typed/core';

/**
 * A Brazilian full name: at least a first name and a surname. There is no
 * check digit for a name — `isValid` only confirms it looks like a plausible
 * full name (at least two words, each made of letters — including accented
 * Portuguese characters — apostrophes, or hyphens).
 */
export class FullName extends ValueObject {
  public constructor(raw: string) {
    super(raw);
  }

  protected isValid(raw: string): boolean {
    const words = normalize(raw).split(' ');
    // The lookahead requires at least one real letter per word, so a word
    // made only of apostrophes/hyphens (e.g. "- -") is rejected even though
    // those characters are otherwise allowed inside a word.
    return (
      words.length >= 2 &&
      words.every((word) => /^(?=.*[A-Za-zÀ-ÖØ-öø-ÿ])[A-Za-zÀ-ÖØ-öø-ÿ'-]+$/.test(word))
    );
  }

  /** The first word: `"Ana Maria Silva Santos"` -> `"Ana"`. */
  public firstName(): string {
    return normalize(this.toString()).split(' ')[0];
  }

  /** Everything after the first word: `"Ana Maria Silva Santos"` -> `"Maria Silva Santos"`. */
  public lastName(): string {
    return normalize(this.toString()).split(' ').slice(1).join(' ');
  }

  /**
   * Every word reduced to its first letter plus an asterisk for each
   * remaining character, so none of the name's content past the first
   * letter of each word is shown: `"Ana Maria Silva Santos"` ->
   * `"A** M**** S**** S*****"`.
   */
  public redact(): string {
    return normalize(this.toString())
      .split(' ')
      .map((word) => word.charAt(0) + '*'.repeat(word.length - 1))
      .join(' ');
  }
}

function normalize(raw: string): string {
  // NFC-normalize first: a name typed or read from a macOS filesystem is
  // often NFD (each accented letter as a base letter + separate combining
  // mark), which the character class below — and `.redact()`'s per-word
  // character count — would otherwise treat as containing a disallowed/extra
  // character instead of the single accented letter it visually is.
  return raw.normalize('NFC').trim().replace(/\s+/g, ' ');
}
