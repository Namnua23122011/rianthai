export const progressStorageKey = 'rianthai-progress-v3'
export const topicsStorageKey = 'rianthai-topics-v3'

export const completionTarget = level => level.type === 'slideshow' ? 1 : level.questions.length

const isValidScore = (score, target) => Number.isInteger(score) && score >= 0 && score <= target

export const isValidProgress = (value, levels) => Array.isArray(value)
  && value.length === levels.length
  && value.every((score, index) => isValidScore(score, completionTarget(levels[index])))

// The original first lesson had eight questions. Preserve earned completion and
// the other quiz scores when replacing that lesson with the slide presentation.
export function migrateLegacyProgress(value, levels, version = 1) {
  return levels.map((level, index) => {
    const score = Array.isArray(value) ? value[index] : undefined
    if (index === 0 && level.type === 'slideshow') return score === (version === 2 ? 1 : 8) ? 1 : 0
    if (index === 1 && level.type === 'slideshow') return score === 3 ? 1 : 0
    return isValidScore(score, completionTarget(level)) ? score : 0
  })
}
