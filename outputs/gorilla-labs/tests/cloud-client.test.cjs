const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const clientSource = fs.readFileSync(path.join(__dirname, '..', 'cloud-client.js'), 'utf8');

function makeClient(fetchMock, config) {
  const window = { GORILLA_CLOUD_CONFIG: config, crypto: { randomUUID: () => '123e4567-e89b-42d3-a456-426614174000' } };
  const context = { window, fetch: fetchMock, crypto: window.crypto, console };
  vm.runInNewContext(clientSource, context, { filename: 'cloud-client.js' });
  return window.GorillaCloud;
}

test('refuses to claim online submission when cloud config is absent', async () => {
  const client = makeClient(async () => { throw new Error('fetch should not run'); }, { supabaseUrl: '', publishableKey: '' });
  assert.equal(client.isConfigured(), false);
  await assert.rejects(() => client.submitProfile({ name: 'Prueba' }), /no está conectado/i);
});

test('allows HTTP only for local Supabase development', () => {
  const fetchMock = async () => { throw new Error('not used'); };
  assert.equal(makeClient(fetchMock, { supabaseUrl: 'http://127.0.0.1:54321', publishableKey: 'local-public-key' }).isConfigured(), true);
  assert.equal(makeClient(fetchMock, { supabaseUrl: 'http://example.com', publishableKey: 'public-key' }).isConfigured(), false);
});

test('sends a profile to submit-profile and reuses its idempotency id', async () => {
  const requests = [];
  const client = makeClient(async (url, options) => {
    requests.push({ url, options });
    return { ok: true, status: 201, json: async () => ({ ok: true, receiptId: 'server-record-1' }) };
  }, { supabaseUrl: 'https://demo.supabase.co', publishableKey: 'sb_publishable_public_example' });
  const profile = { name: 'Cliente de prueba' };
  await client.submitProfile(profile);
  await client.submitProfile(profile);
  assert.equal(requests.length, 2);
  assert.equal(requests[0].url, 'https://demo.supabase.co/functions/v1/submit-profile');
  assert.equal(requests[0].options.headers.apikey, 'sb_publishable_public_example');
  assert.equal(JSON.parse(requests[0].options.body).submissionId, '123e4567-e89b-42d3-a456-426614174000');
  assert.equal(JSON.parse(requests[1].options.body).submissionId, JSON.parse(requests[0].options.body).submissionId);
});

test('uses the signed-in administrator token for central record access', async () => {
  const requests = [];
  const client = makeClient(async (url, options) => {
    requests.push({ url, options });
    if (url.includes('/auth/v1/token?grant_type=password')) {
      return { ok: true, status: 200, json: async () => ({ access_token: 'admin-session-token', refresh_token: 'refresh', user: { email: 'admin@example.com' } }) };
    }
    return { ok: true, status: 200, json: async () => ({ ok: true, profiles: [] }) };
  }, { supabaseUrl: 'https://demo.supabase.co', publishableKey: 'sb_publishable_public_example' });
  await client.adminSignIn('admin@example.com', 'not-a-real-password');
  const result = await client.adminListProfiles();
  assert.equal(result.profiles.length, 0);
  assert.equal(requests[1].url, 'https://demo.supabase.co/functions/v1/admin-profiles');
  assert.equal(requests[1].options.headers.Authorization, 'Bearer admin-session-token');
});
