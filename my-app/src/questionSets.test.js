import test from 'node:test'
import assert from 'node:assert/strict'
import { questionSets, scoreAnswers } from './questionSets.js'

test('second chapter preserves seven supplied questions and answer key', () => {
  const { questions } = questionSets[1]
  assert.equal(questions.length, 7)
  assert.ok(questions.every(q => q.options.length === 4))
  assert.deepEqual(questions.map(q => q.answer), [1, 0, 2, 1, 1, 3, 1])
  assert.equal(scoreAnswers(questions, [1, 0, 2, 1, 1, 3, 1]), 7)
  assert.equal(scoreAnswers(questions, [0, 1, 0, 0, 0, 0, 0]), 0)
})

test('first supplied set has eight questions and the exact answer key', () => {
  const { questions } = questionSets[0]
  assert.equal(questions.length, 8)
  assert.ok(questions.every(q => q.options.length === 4))
  assert.deepEqual(questions.map(q => q.answer), [1, 2, 0, 3, 0, 1, 2, 3])
})

test('scores count correct responses only, including the last question', () => {
  const { questions } = questionSets[0]
  assert.equal(scoreAnswers(questions, []), 0)
  assert.equal(scoreAnswers(questions, questions.map(q => q.answer)), 8)
  assert.equal(scoreAnswers(questions, [0, 0, 0, 0, 0, 0, 0, 3]), 3)
})
