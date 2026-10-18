'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { StrictTypeError } = require('@ts-typed/compiler');
const { FullName } = require('../../dist/br');

test('FullName accepts a two-word name and exposes firstName/lastName/redact', () => {
  const name = new FullName('Ana Silva');
  assert.equal(name.firstName(), 'Ana');
  assert.equal(name.lastName(), 'Silva');
  assert.equal(name.redact(), `A${'*'.repeat(2)} S${'*'.repeat(4)}`);
});

test('FullName splits a multi-word name: lastName keeps everything after the first word', () => {
  const name = new FullName('Ana Maria Silva Santos');
  assert.equal(name.firstName(), 'Ana');
  assert.equal(name.lastName(), 'Maria Silva Santos');
  assert.equal(name.redact(), `A${'*'.repeat(2)} M${'*'.repeat(4)} S${'*'.repeat(4)} S${'*'.repeat(5)}`);
});

test('FullName accepts accented letters, apostrophes and hyphens', () => {
  const name = new FullName("José D'Ávila-Muñoz");
  assert.equal(name.firstName(), 'José');
  assert.equal(name.lastName(), "D'Ávila-Muñoz");
  assert.equal(name.redact(), `J${'*'.repeat(3)} D${'*'.repeat("D'Ávila-Muñoz".length - 1)}`);
});

test('FullName rejects a single word (no surname)', () => {
  assert.throws(() => new FullName('Ana'), StrictTypeError);
  assert.throws(() => new FullName('   Ana   '), StrictTypeError);
});

test('FullName rejects digits and disallowed symbols', () => {
  assert.throws(() => new FullName('Ana Silva 2'), StrictTypeError);
  assert.throws(() => new FullName('Ana S1lva'), StrictTypeError);
  assert.throws(() => new FullName('Ana Silva!'), StrictTypeError);
  assert.throws(() => new FullName('Ana @Silva'), StrictTypeError);
});

test('FullName normalizes extra, leading and trailing whitespace', () => {
  const messy = new FullName('  Ana   Silva  ');
  const clean = new FullName('Ana Silva');
  assert.equal(messy.firstName(), clean.firstName());
  assert.equal(messy.lastName(), clean.lastName());
  assert.equal(messy.redact(), clean.redact());
  assert.equal(messy.redact(), `A${'*'.repeat(2)} S${'*'.repeat(4)}`);
});

test('FullName behaves like a string', () => {
  const name = new FullName('Ana Silva');
  assert.equal(`${name}`, 'Ana Silva');
  assert.equal(name.toString(), 'Ana Silva');
  assert.equal(name.length, 9);
  assert.equal(name.toUpperCase(), 'ANA SILVA');
});
