# Changelog

All notable changes to `@ts-typed/validators` are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-10-18

### Added

- Initial release: six Brazilian document/data validators built on `@ts-typed/compiler`'s `ValueObject` (0.1.21) — `CPF`, `CNPJ` (both the legacy numeric format and the alphanumeric format in effect from July 2026, verified against the official Receita Federal test vector), `PIS` (with `Pasep`/`Nis`/`Nit` aliases — same number, same check digit, four government program names), `CEP`, `Placa` (legacy and Mercosul formats), and `CNH` (verified against the `Respect\Validation` PHP library's reference implementation). `RG` is deliberately not included — there is no nationally standardized check digit for it. `CEP` and `Placa` validate format only (neither has a check digit at all). Each class accepts either a formatted or bare input string, exposes `.numbers()` (normalized, unformatted) and, where a natural display format exists, `.masked()`.
