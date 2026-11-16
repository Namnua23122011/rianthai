import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { createRound, gameReducer, letterPairs } from './matchingCards.js'

const flip = (state, id) => gameReducer(state, { type: 'flip', id, now: 5000 })
const start = state => gameReducer(state, { type: 'start', now: 1000 })

test('every playable pair has real assets and exactly one card of each script', () => {
  assert.equal(letterPairs.length, 39)
  for (const count of [6, 10, 15, 39]) {
    const round = createRound(count)
    assert.equal(round.deck.length, count * 2)
    assert.equal(new Set(round.deck.map(card => card.id)).size, count * 2)
    for (const card of round.deck) {
      assert.ok(existsSync(new URL(`../public${card.image}`, import.meta.url)))
      const pair = round.deck.filter(other => other.pairId === card.pairId)
      assert.equal(pair.length, 2)
      assert.notEqual(pair[0].kind, pair[1].kind)
      assert.ok(!/\/(24|35|37|85|89)\.jpg$/.test(card.image))
    }
  }
})

test('both supplied forms of ฐ can be chosen', () => {
  const get = random => createRound(39, random).deck.find(card => card.id === 'ฐ-ancient').image
  assert.ok(get(() => 0).endsWith('/32.jpg'))
  assert.ok(get(() => 0.999).endsWith('/33.jpg'))
})

test('cards cannot open before starting or count the same card twice', () => {
  const round = createRound()
  assert.equal(flip(round, round.deck[0].id), round)
  const first = flip(start(round), round.deck[0].id)
  assert.equal(flip(first, round.deck[0].id), first)
  assert.equal(first.moves, 0)
})

test('a mismatch blocks a third flip until it is hidden', () => {
  let state = start(createRound())
  const first = state.deck[0]
  const second = state.deck.find(card => card.pairId !== first.pairId)
  state = flip(flip(state, first.id), second.id)
  assert.equal(state.moves, 1)
  assert.equal(state.selected.length, 2)
  assert.equal(flip(state, state.deck.find(card => !state.selected.includes(card.id)).id), state)
  state = gameReducer(state, { type: 'hide' })
  assert.deepEqual(state.selected, [])
  assert.equal(state.matched.length, 0)
})

test('matching every pair wins, counts attempts and stops accepting flips', () => {
  let state = start(createRound())
  for (const pairId of new Set(state.deck.map(card => card.pairId))) {
    const pair = state.deck.filter(card => card.pairId === pairId)
    state = flip(flip(state, pair[0].id), pair[1].id)
    assert.equal(flip(state, pair[0].id), state)
  }
  assert.equal(state.status, 'won')
  assert.equal(state.moves, 6)
  assert.equal(state.matched.length, 12)
  assert.equal(state.finishedAt, 5000)
})

test('reset clears the current selection, counters and timing', () => {
  let state = start(createRound())
  state = flip(state, state.deck[0].id)
  state = gameReducer(state, { type: 'reset', round: createRound(10) })
  assert.equal(state.deck.length, 20)
  assert.equal(state.status, 'ready')
  assert.equal(state.moves, 0)
  assert.equal(state.startedAt, null)
  assert.deepEqual(state.selected, [])
  assert.deepEqual(state.matched, [])
})
