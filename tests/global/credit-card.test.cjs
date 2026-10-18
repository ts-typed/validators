'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { StrictTypeError } = require('@ts-typed/compiler');
const { CreditCard } = require('../../dist/global');

// 4532015112830366 is a Luhn-valid test number (checked independently with the
// Luhn algorithm); changing the last digit breaks the checksum.

test('CreditCard accepts a Luhn-valid number and exposes numbers/masked/redact', () => {
  const card = new CreditCard('4532015112830366');
  assert.equal(card.numbers(), '4532015112830366');
  assert.equal(card.masked(), '**** **** **** 0366');
  assert.equal(card.redact(), '**** **** **** 0366');
});

test('CreditCard accepts spaces and hyphens as separators, same as the bare digits', () => {
  const spaced = new CreditCard('4532 0151 1283 0366');
  const hyphened = new CreditCard('4532-0151-1283-0366');
  const bare = new CreditCard('4532015112830366');
  assert.equal(spaced.numbers(), '4532015112830366');
  assert.equal(hyphened.numbers(), '4532015112830366');
  assert.equal(spaced.masked(), bare.masked());
  assert.equal(hyphened.masked(), bare.masked());
});

test('CreditCard rejects a number that fails the Luhn check', () => {
  assert.throws(() => new CreditCard('4532015112830367'), StrictTypeError);
  assert.throws(() => new CreditCard('4532 0151 1283 0367'), StrictTypeError);
});

test('CreditCard rejects a value with the wrong length', () => {
  assert.throws(() => new CreditCard('4532 0151'), StrictTypeError); // 8 digits, too short
  assert.throws(() => new CreditCard('45320151128303660000'), StrictTypeError); // 20 digits, too long
});

test('CreditCard rejects non-digit characters', () => {
  assert.throws(() => new CreditCard('4532A15112830366'), StrictTypeError);
  assert.throws(() => new CreditCard('4532.0151.1283.0366'), StrictTypeError);
});

test('CreditCard behaves like a string', () => {
  const card = new CreditCard('4532015112830366');
  assert.equal(`${card}`, '4532015112830366');
  assert.equal(card.toString(), '4532015112830366');
  assert.equal(card.length, 16);
});
