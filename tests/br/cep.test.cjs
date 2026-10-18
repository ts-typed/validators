'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { StrictTypeError } = require('@ts-typed/compiler');
const { CEP } = require('../../dist/br');

test('CEP accepts a formatted value and exposes masked/numbers/redact', () => {
  const cep = new CEP('12345-678');
  assert.equal(cep.masked(), '12345-678');
  assert.equal(cep.numbers(), '12345678');
  assert.equal(cep.redact(), '*****-678');
});

test('CEP accepts the same value without formatting', () => {
  const cep = new CEP('12345678');
  assert.equal(cep.masked(), '12345-678');
  assert.equal(cep.numbers(), '12345678');
});

test('CEP rejects wrong length and non-digits', () => {
  assert.throws(() => new CEP('1234567'), StrictTypeError);
  assert.throws(() => new CEP('123456789'), StrictTypeError);
  assert.throws(() => new CEP('1234-567A'), StrictTypeError);
});

test('CEP behaves like a string', () => {
  const cep = new CEP('12345678');
  assert.equal(`${cep}`, '12345678');
  assert.equal(cep.toString(), '12345678');
  assert.equal(cep.length, 8);
  assert.equal(cep.padStart(10, '0'), '0012345678');
});
