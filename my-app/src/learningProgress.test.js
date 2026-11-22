import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { levels } from './learning.js'
import { completionTarget, isValidProgress, migrateLegacyProgress } from './learningProgress.js'

test('the first lesson uses all sixteen supplied slides in order', () => {
  const lesson = levels[0]
  assert.equal(lesson.type, 'slideshow')
  assert.equal(lesson.questions, undefined)
  assert.equal(lesson.slides.length, 16)
  lesson.slides.forEach((slide, index) => {
    assert.ok(slide.image.endsWith(`slide-${String(index + 1).padStart(2, '0')}.jpg`))
    assert.ok(existsSync(new URL(`../public${slide.image}`, import.meta.url)))
  })
})

test('completed legacy lessons and quiz scores survive the slide replacement', () => {
  assert.deepEqual(migrateLegacyProgress([8, 3, 2], levels), [1, 3, 2])
  assert.deepEqual(migrateLegacyProgress([7, 2, 0], levels), [0, 2, 0])
  assert.deepEqual(migrateLegacyProgress([undefined, 2, 99], levels), [0, 2, 0])
  assert.deepEqual(migrateLegacyProgress(null, levels), [0, 0, 0])
})

test('slide completion is independent of quiz answer counts', () => {
  assert.deepEqual(levels.map(completionTarget), [1, 3, 3])
  assert.equal(isValidProgress([1, 3, 0], levels), true)
  for (const invalid of [[8, 0, 0], [16, 0, 0], [1, 4, 0], [1, -1, 0], [1, 1.5, 0], [1], null]) {
    assert.equal(isValidProgress(invalid, levels), false)
  }
})
