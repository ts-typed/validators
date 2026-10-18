# @ts-typed/validators

Document/data validators built on [`@ts-typed/compiler`](https://www.npmjs.com/package/@ts-typed/compiler)'s `ValueObject` — declare a type, and `@ts-typed/compiler` auto-constructs and validates it at every typed boundary, no decorator or manual `new` needed.

```bash
npm install @ts-typed/validators
```

```ts
import { CPF } from '@ts-typed/validators'; // or '@ts-typed/validators/br'

export class CreateUserDto {
  public readonly cpf!: CPF; // declared as CPF, populated from JSON as a plain string
}

class UserService {
  public create(dto: CreateUserDto) {
    console.log(dto.cpf);          // "12345678909" (or however the client sent it)
    console.log(dto.cpf.masked());  // "123.456.789-09"
    console.log(dto.cpf.numbers()); // "12345678909"
  }
}
```

With `@ts-typed/compiler`'s build step, the raw string the client sent for `cpf` auto-constructs into a validated `CPF` instance the moment it's assigned — no `new CPF(...)` anywhere in application code, and an invalid CPF throws before `create()` ever runs.

Each class behaves like a string everywhere it matters (`console.log`, template literals, `JSON.stringify`, every native `String.prototype` method), while adding its own validation and formatting methods. See [`@ts-typed/compiler`'s README](https://github.com/ts-typed/compiler#readme) for the full `ValueObject`/auto-construction mechanism this package builds on.

## Validators (Brazil)

Import from `@ts-typed/validators` or `@ts-typed/validators/br` (same exports, either path):

| Class | Document | Check digit | Accepts |
|---|---|---|---|
| `CPF` | Cadastro de Pessoa Física | Modulus 11 | `"123.456.789-09"` or `"12345678909"` |
| `CNPJ` | Cadastro Nacional da Pessoa Jurídica | Modulus 11 | Legacy numeric (`"11.222.333/0001-81"`) **and** the alphanumeric format in effect from July 2026 (`"12.ABC.345/01DE-35"`) |
| `PIS` (aliases `Pasep`, `Nis`, `Nit`) | PIS/PASEP/NIS/NIT — same 11-digit number, same check digit, four government program names | Modulus 11 | `"120.65328.70-5"` or `"12065328705"` |
| `CEP` | Postal code | Format only — no check digit exists | `"01310-100"` or `"01310100"` |
| `Placa` | Vehicle plate | Format only — no check digit exists | Legacy (`"ABC1234"`) or Mercosul (`"ABC1D23"`) |
| `CNH` | Driver's license number | Modulus 11 | `"03215478120"` |
| `FullName` | Full name (first + surname) | None — plausibility only | `"Ana Maria Silva Santos"` |

Every document class exposes `.numbers()` (the normalized, unformatted value) and, where there's a natural display format, `.masked()`. `CNH` has no standard formatted display form, so it only exposes `.numbers()`. `FullName` exposes `.firstName()` and `.lastName()` instead.

**`CEP` and `Placa` validate FORMAT only** — neither document type has a nationally standardized check digit, so these confirm shape (length/pattern), not that a specific number was actually issued.

## Privacy masking (`.redact()`)

Every class — including `FullName` — exposes `.redact()`, for displaying a value in a context where the full value shouldn't be shown (logs, public listings, support tooling):

```ts
new CPF('123.456.789-09').redact();                    // "***.456.789-**"
new CEP('12345-678').redact();                          // "*****-678"
new FullName('Ana Maria Silva Santos').redact();        // "A** M**** S**** S*****"
```

Brazil has no single federal standard for this (there's an open legislative proposal asking for one, precisely because different institutions using different masks makes a number easier to reconstruct by cross-referencing). `CPF`'s format matches a real, documented state transparency-portal convention; the rest follow the same principle for consistency, not independent sourcing per document type. `CNPJ` identifies a legal entity, not a natural person, so LGPD's personal-data rules don't apply to it the way they do the others — its `.redact()` exists for API consistency, not because redacting a CNPJ is commonly required.

## Why no `RG`

An RG (Registro Geral) has no nationally standardized check digit — the format and whether a check digit exists at all varies by issuing state, and many states have none. Shipping an `RG` class would mean pretending to validate something that can't actually be validated nationwide, so it's deliberately not included.

## License

Apache-2.0
