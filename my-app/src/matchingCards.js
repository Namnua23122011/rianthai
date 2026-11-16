// Source: the user's ก (1).zip. Numbers refer to the original image filenames.
// Both forms of ฐ are accepted; pick one per round so its modern card is unique.
const definitions = [
  ['ก', [2], 3], ['ข', [4], 5], ['ฃ', [6], 7], ['ค', [8], 9],
  ['ฅ', [10], 11], ['ฆ', [12], 13], ['ง', [14], 15], ['จ', [16], 17],
  ['ฉ', [18], 19], ['ช', [20], 21], ['ซ', [22], 23], ['ญ', [26], 27],
  ['ฎ', [28], 29], ['ฏ', [30], 31], ['ฐ', [32, 33], 34], ['ณ', [39], 40],
  ['ด', [41], 42], ['ต', [43], 44], ['ถ', [45], 46], ['ท', [47], 48],
  ['ธ', [49], 50], ['น', [51], 52], ['บ', [53], 54], ['ป', [55], 56],
  ['ผ', [57], 58], ['ฝ', [59], 60], ['พ', [61], 62], ['ฟ', [63], 64],
  ['ภ', [65], 66], ['ม', [67], 68], ['ย', [69], 70], ['ร', [71], 72],
  ['ล', [73], 74], ['ว', [75], 76], ['ศ', [77], 78], ['ษ', [79], 80],
  ['ส', [81], 82], ['ห', [83], 84], ['อ', [87], 88],
]

export const cardImage = number => `${import.meta.env?.BASE_URL ?? '/'}ramkhamhaeng/${number}.jpg`
export const cardBack = cardImage(1)
export const letterPairs = definitions.map(([letter, ancient, modern]) => ({
  id: letter, letter, ancient, modern,
}))

export function shuffle(items, random = Math.random) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function createRound(count = 6, random = Math.random) {
  const pairs = shuffle(letterPairs, random).slice(0, Math.max(1, Math.min(count, letterPairs.length)))
  const deck = shuffle(pairs.flatMap(pair => [
    { id: `${pair.id}-ancient`, pairId: pair.id, letter: pair.letter, kind: 'ancient', image: cardImage(pair.ancient[Math.floor(random() * pair.ancient.length)]) },
    { id: `${pair.id}-modern`, pairId: pair.id, letter: pair.letter, kind: 'modern', image: cardImage(pair.modern) },
  ]), random)
  return { deck, selected: [], matched: [], moves: 0, status: 'ready', startedAt: null, finishedAt: null, message: 'พร้อมแล้ว กดเริ่มเกมเพื่อเปิดการ์ดใบแรก' }
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'reset': return action.round
    case 'start':
      return state.status === 'ready' ? { ...state, status: 'playing', startedAt: action.now, message: 'เลือกการ์ด 2 ใบเพื่อจับคู่ตัวอักษร' } : state
    case 'hide':
      return state.selected.length === 2 ? { ...state, selected: [], message: 'ลองอีกครั้ง ค่อย ๆ จำตำแหน่งของตัวอักษร' } : state
    case 'flip': {
      if (state.status !== 'playing' || state.selected.length === 2 || state.selected.includes(action.id) || state.matched.includes(action.id)) return state
      const card = state.deck.find(item => item.id === action.id)
      if (!card) return state
      if (!state.selected.length) return { ...state, selected: [card.id], message: 'เปิดอีกใบเพื่อหาตัวอักษรที่คู่กัน' }
      const first = state.deck.find(item => item.id === state.selected[0])
      const moves = state.moves + 1
      if (first.pairId !== card.pairId) return { ...state, selected: [first.id, card.id], moves, message: 'ยังไม่ใช่คู่กัน จำตำแหน่งไว้แล้วลองใหม่' }
      const matched = [...state.matched, first.id, card.id]
      const won = matched.length === state.deck.length
      return { ...state, selected: [], matched, moves, status: won ? 'won' : 'playing', finishedAt: won ? action.now : null, message: won ? 'ยอดเยี่ยม! จับคู่ตัวอักษรครบทุกคู่แล้ว' : `ถูกต้อง! จับคู่ตัว ${card.letter} สำเร็จ` }
    }
    default: return state
  }
}
