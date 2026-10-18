'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { StrictTypeError } = require('@ts-typed/compiler');
const { PIS, Pasep, Nis, Nit } = require('../../dist/br');

test('PIS accepts a formatted valid value and exposes masked/numbers', () => {
  const pis = new PIS('120.65328.70-5');
  assert.equal(pis.masked(), '120.65328.70-5');
  assert.equal(pis.numbers(), '12065328705');
});

test('PIS accepts the same value without formatting', () => {
  const pis = new PIS('12065328705');
  assert.equal(pis.masked(), '120.65328.70-5');
  assert.equal(pis.numbers(), '12065328705');
});

test('PIS rejects a wrong check digit and wrong length', () => {
  assert.throws(() => new PIS('120.65328.70-6'), StrictTypeError);
  assert.throws(() => new PIS('1206532870'), StrictTypeError);
  assert.throws(() => new PIS('120653287055'), StrictTypeError);
});

test('PIS rejects all-identical digits', () => {
  for (const d of '0123456789') {
    assert.throws(() => new PIS(d.repeat(11)), StrictTypeError);
  }
});

test('PASEP, NIS and NIT are aliases of the same class', () => {
  assert.equal(Pasep, PIS);
  assert.equal(Nis, PIS);
  assert.equal(Nit, PIS);
  assert.ok(new Nit('12065328705') instanceof PIS);
});

test('PIS behaves like a string', () => {
  const pis = new PIS('12065328705');
  assert.equal(`${pis}`, '12065328705');
  assert.equal(pis.toString(), '12065328705');
  assert.equal(pis.length, 11);
  assert.equal(pis.trim(), '12065328705');
});
