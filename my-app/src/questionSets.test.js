import test from 'node:test'
import assert from 'node:assert/strict'
import { questionSets, scoreAnswers } from './questionSets.js'

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
