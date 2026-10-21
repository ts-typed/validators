'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { StrictTypeError } = require('@ts-typed/core');
const { Placa } = require('../../dist/br');

test('Placa accepts a formatted legacy plate', () => {
  const placa = new Placa('ABC-1234');
  assert.equal(placa.masked(), 'ABC-1234');
  assert.equal(placa.numbers(), 'ABC1234');
});

test('Placa accepts a legacy plate without formatting', () => {
  const placa = new Placa('ABC1234');
  assert.equal(placa.masked(), 'ABC-1234');
  assert.equal(placa.numbers(), 'ABC1234');
});

test('Placa accepts a Mercosul plate, formatted or not, and displays it without separator', () => {
  const formatted = new Placa('abc 1d23');
  assert.equal(formatted.masked(), 'ABC1D23');
  assert.equal(formatted.numbers(), 'ABC1D23');

  const bare = new Placa('ABC1D23');
  assert.equal(bare.masked(), 'ABC1D23');
  assert.equal(bare.numbers(), 'ABC1D23');
});

test('Placa rejects wrong shape and length', () => {
  assert.throws(() => new Placa('AB1234'), StrictTypeError);
  assert.throws(() => new Placa('ABC12345'), StrictTypeError);
  assert.throws(() => new Placa('ABCD123'), StrictTypeError);
  assert.throws(() => new Placa('1BC1D23'), StrictTypeError);
  assert.throws(() => new Placa('ABC1DE3'), StrictTypeError);
});

test('Placa behaves like a string', () => {
  const placa = new Placa('ABC1234');
  assert.equal(`${placa}`, 'ABC1234');
  assert.equal(placa.toString(), 'ABC1234');
  assert.equal(placa.length, 7);
  assert.equal(placa.toLowerCase(), 'abc1234');
});

test('Placa redact shows the 3-letter prefix and masks the rest, for either format', () => {
  const legacy = new Placa('ABC1234');
  assert.equal(legacy.redact(), 'ABC****');
  assert.equal(legacy.masked(), 'ABC-1234');
  assert.equal(legacy.numbers(), 'ABC1234');

  const mercosul = new Placa('ABC1D23');
  assert.equal(mercosul.redact(), 'ABC****');
  assert.equal(mercosul.masked(), 'ABC1D23');
  assert.equal(mercosul.numbers(), 'ABC1D23');
});
