'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { StrictTypeError } = require('@ts-typed/compiler');
const { CPF } = require('../../dist/br');

test('CPF accepts a formatted valid value and exposes masked/numbers', () => {
  const cpf = new CPF('123.456.789-09');
  assert.equal(cpf.masked(), '123.456.789-09');
  assert.equal(cpf.numbers(), '12345678909');
});

test('CPF accepts the same value without formatting', () => {
  const cpf = new CPF('12345678909');
  assert.equal(cpf.masked(), '123.456.789-09');
  assert.equal(cpf.numbers(), '12345678909');
});

test('CPF rejects a wrong check digit, wrong length and non-digits', () => {
  assert.throws(() => new CPF('123.456.789-00'), StrictTypeError);
  assert.throws(() => new CPF('1234567890'), StrictTypeError);
  assert.throws(() => new CPF('123456789090'), StrictTypeError);
  assert.throws(() => new CPF('12345678A09'), StrictTypeError);
});

test('CPF rejects all-identical digits', () => {
  for (const d of '0123456789') {
    assert.throws(() => new CPF(d.repeat(11)), StrictTypeError);
  }
});

test('CPF behaves like a string', () => {
  const cpf = new CPF('12345678909');
  assert.equal(`${cpf}`, '12345678909');
  assert.equal(cpf.toString(), '12345678909');
  assert.equal(cpf.length, 11);
  assert.equal(cpf.slice(0, 3), '123');
  assert.equal(JSON.stringify({ cpf }), '{"cpf":"12345678909"}');
});
