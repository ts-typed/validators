'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const root = require('../../dist');
const br = require('../../dist/br');

test('root and br entry points export the same validators', () => {
  for (const name of ['CPF', 'CNPJ', 'PIS', 'Pasep', 'Nis', 'Nit', 'CEP', 'Placa', 'CNH']) {
    assert.equal(root[name], br[name], name);
    assert.equal(typeof br[name], 'function', name);
  }
});
