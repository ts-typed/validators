'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { StrictTypeError } = require('@ts-typed/compiler');
const { CNPJ } = require('../../dist/br');

test('CNPJ official alphanumeric test vector validates', () => {
  // Receita Federal test vector: base "12ABC34501DE" -> check digits "35".
  const cnpj = new CNPJ('12ABC34501DE35');
  assert.equal(cnpj.numbers(), '12ABC34501DE35');
  assert.equal(cnpj.masked(), '12.ABC.345/01DE-35');
});

test('CNPJ official vector with formatting and lowercase letters validates', () => {
  const cnpj = new CNPJ('12.abc.345/01de-35');
  assert.equal(cnpj.numbers(), '12ABC34501DE35');
  assert.equal(cnpj.masked(), '12.ABC.345/01DE-35');
});

test('CNPJ rejects the same base with other check digits', () => {
  for (const dv of ['00', '34', '36', '99', '53']) {
    assert.throws(() => new CNPJ(`12ABC34501DE${dv}`), StrictTypeError);
  }
});

test('CNPJ legacy all-numeric fixture validates', () => {
  const formatted = new CNPJ('11.222.333/0001-81');
  assert.equal(formatted.masked(), '11.222.333/0001-81');
  assert.equal(formatted.numbers(), '11222333000181');

  const bare = new CNPJ('11222333000181');
  assert.equal(bare.masked(), '11.222.333/0001-81');
  assert.equal(bare.numbers(), '11222333000181');
});

test('CNPJ rejects a wrong legacy check digit, wrong length and invalid characters', () => {
  assert.throws(() => new CNPJ('11222333000182'), StrictTypeError);
  assert.throws(() => new CNPJ('1122233300018'), StrictTypeError);
  assert.throws(() => new CNPJ('11222333000181X'), StrictTypeError);
  assert.throws(() => new CNPJ('1122233300018$'), StrictTypeError);
});

test('CNPJ behaves like a string', () => {
  const cnpj = new CNPJ('11222333000181');
  assert.equal(`${cnpj}`, '11222333000181');
  assert.equal(cnpj.toString(), '11222333000181');
  assert.equal(cnpj.length, 14);
  assert.equal(cnpj.toUpperCase(), '11222333000181');
});
