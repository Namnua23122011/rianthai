import test from 'node:test'
import assert from 'node:assert/strict'
import { createSaveQueue, emptyRecord, validRecord, authMessage } from './accountData.js'

test('records reject invalid scores, dimensions, and oversized titles', () => {
  assert.ok(validRecord(emptyRecord()))
  for (const progress of [[2, 0, 0], [0, 0], ['1', 0, 0]]) assert.ok(!validRecord({ ...emptyRecord(), progress }))
  assert.ok(!validRecord({ ...emptyRecord(), topics: ['x'.repeat(81), '', ''] }))
  assert.ok(!validRecord(null))
  const a = emptyRecord(); a.progress[0] = 1
  assert.equal(emptyRecord().progress[0], 0)
})

test('saves are ordered and recover after a rejected request', async () => {
  const calls = []
  let release
  const first = new Promise(resolve => { release = resolve })
  const save = createSaveQueue(async value => {
    calls.push(value)
    if (value === 1) { await first; throw new Error('Offline') }
  })
  const rejected = assert.rejects(save(1), /Offline/)
  const b = save(2)
  await Promise.resolve()
  assert.deepEqual(calls, [1])
  release()
  await rejected; await b
  assert.deepEqual(calls, [1, 2])
})

test('auth failures show Thai text without exposing server details', () => {
  assert.equal(authMessage({ code: 'invalid_credentials' }), 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
  assert.ok(!authMessage({ message: 'secret internal details' }).includes('secret'))
})
