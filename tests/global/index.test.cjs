'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const root = require('../../dist');
const global = require('../../dist/global');
const br = require('../../dist/br');

test('root and global entry points export the same global validators', () => {
  for (const name of ['FullName', 'Email', 'CreditCard']) {
    assert.equal(root[name], global[name], name);
    assert.equal(typeof global[name], 'function', name);
  }
});

test('br entry point no longer exports FullName, and does not export global validators', () => {
  for (const name of ['FullName', 'Email', 'CreditCard']) {
    assert.equal(br[name], undefined, name);
  }
});
