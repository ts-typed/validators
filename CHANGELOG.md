# Changelog

All notable changes to `@ts-typed/validators` are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.4] - 2026-10-19

### Changed

- Bumped the `@ts-typed/compiler` dependency to `0.1.24` (tsconfig "paths" aliases are now resolved and rewritten at build time). No changes to this package's own code.

## [0.1.3] - 2026-10-19

### Changed

- Bumped the `@ts-typed/compiler` dependency to `0.1.23` (generic call/construct validation now also covers inferred type arguments, not just explicit ones). No changes to this package's own code.

## [0.1.2] - 2026-10-18

### Changed

- **`FullName` is no longer Brazil-specific.** Moved from `@ts-typed/validators/br` to a new `@ts-typed/validators/global` entry point (also re-exported from the package root). It no longer validates against `./br`'s exports — `require('@ts-typed/validators/br').FullName` is now `undefined`.

### Added

- A new `@ts-typed/validators/global` entry point for validators meant for universal/international use, exporting `FullName`, `Email`, and `CreditCard`.
- `Email`: validates `local-part@domain.tld` pragmatically (not full RFC 5322) — local part allows letters/digits/`._%+-`, domain allows letters/digits/hyphens/dots, must end in a 2+ letter TLD. Adds `.localPart()`, `.domain()`, and `.redact()` (keeps the local part's first character, masks the rest, shows the domain in full: `"ana@example.com"` -> `"a**@example.com"`).
- `CreditCard`: validates a payment card number with the Luhn checksum (network-agnostic, works across card networks worldwide). Accepts spaces/hyphens as separators; the cleaned value must be 12-19 digits and pass the Luhn check. Adds `.numbers()`, `.masked()` (last 4 digits shown, rest masked in groups of 4: `"4532015112830366"` -> `"**** **** **** 0366"`), and `.redact()` (same as `.masked()`).

## [0.1.1] - 2026-10-18

### Added

- A new `FullName` validator: confirms a value looks like a plausible Brazilian full name (at least two words of letters — including accented characters, apostrophes, hyphens), with `.firstName()` (the first word) and `.lastName()` (everything after the first word).
- A `.redact()` privacy-masking method on every class except `CEP`'s own numeric-only predecessor behavior changed too (see below):
  - `CPF`: `"123.456.789-09"` -> `"***.456.789-**"` (hide the first group and the check digits).
  - `CNPJ`: hide the first group and the check digits (works for both the legacy numeric and alphanumeric formats).
  - `PIS`/`Pasep`/`Nis`/`Nit`: hide the first group and the final check digit.
  - `CNH`: hide the first 3 and last 2 of its 11 digits.
  - `Placa`: show the 3-letter prefix, mask everything after it (`"ABC1234"`/`"ABC1D23"` -> `"ABC****"`).
  - `CEP`: hide the first 5 digits (area/sector), show only the last 3 (`"12345-678"` -> `"*****-678"`).
  - `FullName`: every word reduced to its first letter plus one asterisk per remaining character (`"Ana Maria Silva Santos"` -> `"A** M**** S**** S*****"`).

  None of these formats are mandated by a single federal standard — Brazil has no unified rule for this (there's an open legislative proposal asking for one, because fragmented masks across institutions make them easier to reverse-engineer). `CPF`'s format matches a real, documented state transparency-portal convention; the others follow the same principle for consistency, not independent sourcing per document type. `CNPJ` identifies a legal entity, not a natural person — LGPD's personal-data protections don't apply to it the way they do to the others, so `.redact()` there is for API consistency, not a compliance requirement.

### Changed

- Depends on `@ts-typed/compiler@0.1.22` (the version this package's own dependency was pinned to had fallen behind the app-level direct dependency in a real install, creating two separate `ValueObject`/`StrictTypeError` class instances and silently breaking `@Catch(StrictTypeError)` matching — caught via a real end-to-end demo, same root cause documented in `@ts-typed/nestjs`'s own CHANGELOG history).

## [0.1.0] - 2026-10-18

### Added

- Initial release: six Brazilian document/data validators built on `@ts-typed/compiler`'s `ValueObject` (0.1.21) — `CPF`, `CNPJ` (both the legacy numeric format and the alphanumeric format in effect from July 2026, verified against the official Receita Federal test vector), `PIS` (with `Pasep`/`Nis`/`Nit` aliases — same number, same check digit, four government program names), `CEP`, `Placa` (legacy and Mercosul formats), and `CNH` (verified against the `Respect\Validation` PHP library's reference implementation). `RG` is deliberately not included — there is no nationally standardized check digit for it. `CEP` and `Placa` validate format only (neither has a check digit at all). Each class accepts either a formatted or bare input string, exposes `.numbers()` (normalized, unformatted) and, where a natural display format exists, `.masked()`.
