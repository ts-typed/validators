'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { StrictTypeError } = require('@ts-typed/compiler');
const { CNH } = require('../../dist/br');

test('CNH accepts a valid value and exposes numbers()', () => {
  const cnh = new CNH('03215478120');
  assert.equal(cnh.numbers(), '03215478120');
  assert.equal(cnh.masked, undefined);
});

test('CNH accepts a formatted value', () => {
  const cnh = new CNH('032.154.781-20');
  assert.equal(cnh.numbers(), '03215478120');
});

test('CNH rejects a wrong check digit and wrong length', () => {
  assert.throws(() => new CNH('03215478121'), StrictTypeError);
  assert.throws(() => new CNH('03215478110'), StrictTypeError);
  assert.throws(() => new CNH('0321547812'), StrictTypeError);
});

test('CNH rejects all-identical digits', () => {
  for (const d of '0123456789') {
    assert.throws(() => new CNH(d.repeat(11)), StrictTypeError);
  }
});

test('CNH behaves like a string', () => {
  const cnh = new CNH('03215478120');
  assert.equal(`${cnh}`, '03215478120');
  assert.equal(cnh.toString(), '03215478120');
  assert.equal(cnh.length, 11);
  assert.equal(cnh.endsWith('120'), true);
});

test('CNH redact hides the first 3 and last 2 digits, keeping numbers intact', () => {
  const cnh = new CNH('03215478120');
  assert.equal(cnh.redact(), '***154781**');
  assert.equal(cnh.numbers(), '03215478120');
});
