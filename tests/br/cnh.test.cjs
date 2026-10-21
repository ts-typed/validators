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

test('CNH accepts a prefix whose second check digit requires both the +11 and >9->0 adjustments', () => {
  // Prefix "123000032": dv1raw = 54 % 11 = 10 (forces dv1 = 0, and -2 on
  // dv2raw), s2 % 11 = 1, so dv2raw = 1 - 2 = -1. The buggy code mapped
  // -1 -> (-1 + 11) = 10 without then capping it to 0, making this whole
  // class of otherwise-valid CNH numbers impossible to construct.
  const cnh = new CNH('12300003200');
  assert.equal(cnh.numbers(), '12300003200');
  assert.throws(() => new CNH('12300003201'), StrictTypeError);
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
