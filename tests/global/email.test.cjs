'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { StrictTypeError } = require('@ts-typed/compiler');
const { Email } = require('../../dist/global');

test('Email accepts a valid address and exposes localPart/domain/redact', () => {
  const email = new Email('ana@example.com');
  assert.equal(email.localPart(), 'ana');
  assert.equal(email.domain(), 'example.com');
  assert.equal(email.redact(), 'a**@example.com');
});

test('Email redact masks all but the first character of a two-character local part', () => {
  const email = new Email('jo@example.com');
  assert.equal(email.redact(), 'j*@example.com');
});

test('Email redact leaves a one-character local part as-is', () => {
  const email = new Email('j@example.com');
  assert.equal(email.redact(), 'j@example.com');
});

test('Email accepts the allowed local-part and domain characters', () => {
  const email = new Email('first.last+tag_1%x-y@sub-domain.example.co');
  assert.equal(email.localPart(), 'first.last+tag_1%x-y');
  assert.equal(email.domain(), 'sub-domain.example.co');
});

test('Email rejects invalid formats', () => {
  assert.throws(() => new Email('ana.example.com'), StrictTypeError); // no @
  assert.throws(() => new Email('ana@example'), StrictTypeError); // no dot in domain
  assert.throws(() => new Email('ana@example.c'), StrictTypeError); // TLD under 2 letters
  assert.throws(() => new Email('ana silva@example.com'), StrictTypeError); // space
  assert.throws(() => new Email('ana!@example.com'), StrictTypeError); // disallowed char
  assert.throws(() => new Email('@example.com'), StrictTypeError); // empty local part
  assert.throws(() => new Email(''), StrictTypeError);
});

test('Email behaves like a string', () => {
  const email = new Email('ana@example.com');
  assert.equal(`${email}`, 'ana@example.com');
  assert.equal(email.toString(), 'ana@example.com');
  assert.equal(email.length, 15);
  assert.equal(email.toUpperCase(), 'ANA@EXAMPLE.COM');
});
