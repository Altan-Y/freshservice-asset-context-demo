'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../app/scripts/core.js');

const root = path.resolve(__dirname, '..');

assert.equal(core.normalizeEmail('  Alex.Morgan@Example.Test '), 'alex.morgan@example.test');
assert.equal(core.formatDate('2027-11-18'), '18.11.2027');
assert.equal(core.escapeHtml('<script>'), '&lt;script&gt;');
assert.equal(core.getRequesterEmailFromPayload({ ticket: { requester_email: 'a@example.test' } }), 'a@example.test');

const rows = core.filterAssetsForRequester([
  {
    fields: {
      assetId: { value: 'NB-1042' },
      serial: { value: 'SERIAL-1' },
      warranty: { value: '2027-11-18' },
      currentEmployee: { value: 'Alex.Morgan@Example.Test' }
    }
  },
  {
    assetId: 'OTHER',
    serial: 'SERIAL-2',
    currentEmployeeEmail: 'someone.else@example.test'
  }
], 'alex.morgan@example.test');

assert.equal(rows.length, 1);
assert.deepEqual(rows[0], {
  id: 'NB-1042',
  serial: 'SERIAL-1',
  warranty: '18.11.2027',
  employeeEmail: 'alex.morgan@example.test',
  url: ''
});

for (const jsonFile of ['manifest.json', 'config/iparams.json', 'package.json']) {
  JSON.parse(fs.readFileSync(path.join(root, jsonFile), 'utf8'));
}

const filesToScan = [
  'README.md',
  'manifest.json',
  'config/iparams.json',
  'app/index.html',
  'app/scripts/app.js',
  'app/scripts/core.js',
  'app/styles/style.css',
  'docs/ARCHITECTURE.md',
  'docs/FEATURE_PARITY.md',
  'docs/PRODUCTION_VS_DEMO.md'
];
const combined = filesToScan.map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');

const forbidden = [
  /api\.assetpanda\.com/i,
  /groups\/\d+/i,
  /field_\d+/i,
  /access_token\s*[:=]\s*["'][^*]/i,
  /assetpanda_password/i,
  /@chrono24\./i,
  /chrono24/i
];
for (const pattern of forbidden) {
  assert.equal(pattern.test(combined), false, `Forbidden production marker found: ${pattern}`);
}

assert.match(combined, /independently rewritten/i);
assert.match(combined, /synthetic/i);
assert.match(combined, /not included/i);

console.log('All smoke checks passed.');
