import { useEffect, useReducer, useState } from 'react'
import { cardBack, cardImage, createRound, gameReducer, letterPairs } from './matchingCards'
import './MatchingGame.css'

function Clock({ startedAt, finishedAt }) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    if (!startedAt || finishedAt) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [startedAt, finishedAt])
  const seconds = startedAt ? Math.max(0, Math.floor(((finishedAt ?? now) - startedAt) / 1000)) : 0
  return <span>{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</span>
}

export default function MatchingGame() {
  const [state, dispatch] = useReducer(gameReducer, 6, createRound)
  const pairCount = state.deck.length / 2
  const found = state.matched.length / 2

  useEffect(() => {
    if (state.selected.length !== 2) return
    const timeout = setTimeout(() => dispatch({ type: 'hide' }), 1200)
    return () => clearTimeout(timeout)
  }, [state.selected])

  function reset(count = pairCount, start = false) {
    const round = createRound(count)
    dispatch({ type: 'reset', round: start ? gameReducer(round, { type: 'start', now: Date.now() }) : round })
  }

  return <section className="matching-game" aria-label="เกมจับคู่ตัวอักษรพ่อขุนรามคำแหง">
    <header className="match-hero">
      <div className="match-intro">
        <span className="match-kicker">RIANTHAI · เรียนรู้ผ่านการเล่น</span>
        <h1>จับคู่<span>ลายสือไทย</span></h1>
        <p>เปิดการ์ด ย้อนรอยตัวอักษรพ่อขุนรามคำแหง<br />แล้วจับคู่กับอักษรไทยที่เราคุ้นเคยในวันนี้</p>
        <div className="match-pills"><span>อักษรโบราณ ↔ อักษรปัจจุบัน</span><span>คลังตัวอักษร {letterPairs.length} คู่</span></div>
      </div>
      <div className="match-hero-art" aria-hidden="true"><img src={cardImage(2)} className="match-sample ancient" alt="" /><img src={cardBack} className="match-sample cover" alt="" /><img src={cardImage(3)} className="match-sample modern" alt="" /></div>
    </header>

    <div className="match-instructions"><span className="match-step">01</span> เปิดการ์ดสองใบ <span className="match-step">02</span> จับคู่ตัวอักษรเดียวกัน <span className="match-step">03</span> เก็บให้ครบทุกคู่</div>

    <div className="match-toolbar">
      <label className="match-size">จำนวนคู่ต่อรอบ<select value={pairCount} onChange={e => reset(Number(e.target.value))}><option value="6">6 คู่ · เริ่มต้น</option><option value="10">10 คู่ · ฝึกความจำ</option><option value="15">15 คู่ · ท้าทาย</option><option value="39">39 คู่ · ครบทุกตัว</option></select></label>
      <div className="match-stats" aria-label="สถิติรอบนี้"><div><span>จับคู่แล้ว</span><strong>{found}<small> / {pairCount}</small></strong></div><div><span>ครั้งที่ลอง</span><strong>{state.moves}</strong></div><div><span>เวลา</span><strong><Clock key={state.startedAt ?? 'ready'} startedAt={state.startedAt} finishedAt={state.finishedAt} /></strong></div></div>
      <button className="match-action" onClick={() => state.status === 'ready' ? dispatch({ type: 'start', now: Date.now() }) : reset(pairCount, true)}>{state.status === 'ready' ? 'เริ่มเกม →' : '↻ เริ่มรอบใหม่'}</button>
    </div>

    <div className="match-progress" role="progressbar" aria-label="ความคืบหน้าการจับคู่" aria-valuenow={found} aria-valuemin={0} aria-valuemax={pairCount}><span style={{ width: `${found / pairCount * 100}%` }} /></div>
    <p className={`match-message ${state.status === 'won' ? 'success' : ''}`} role="status" aria-live="polite">{state.message}</p>

    {state.status === 'won' && <div className="match-win"><span aria-hidden="true">✦</span><div><h2>เก่งมาก! จับคู่ครบแล้ว</h2><p>คุณรู้จักตัวอักษรเพิ่มอีก {pairCount} คู่ · ใช้ {state.moves} ครั้ง</p></div><button className="match-action" onClick={() => reset(pairCount, true)}>เล่นอีกครั้ง →</button></div>}

    <div className={`match-board ${pairCount > 10 ? 'large' : ''}`} aria-label="กระดานจับคู่">
      {state.deck.map((card, index) => {
        const matched = state.matched.includes(card.id)
        const open = matched || state.selected.includes(card.id)
        const kind = card.kind === 'ancient' ? 'ลายสือไทย' : 'ไทยปัจจุบัน'
        return <button key={card.id} className={`match-card ${open ? 'is-open' : ''} ${matched ? 'is-matched' : ''}`} disabled={state.status !== 'playing' || open || state.selected.length === 2} aria-label={open ? `${kind} ${card.letter}${matched ? ' จับคู่แล้ว' : ''}` : `เปิดการ์ดใบที่ ${index + 1}`} aria-pressed={open} onClick={() => dispatch({ type: 'flip', id: card.id, now: Date.now() })}>
          <span className="match-card-turn"><span className="match-card-side match-card-back" aria-hidden={open}><img src={cardBack} alt="" draggable="false" /><span className="match-card-number">{String(index + 1).padStart(2, '0')}</span></span><span className="match-card-side match-card-front" aria-hidden={!open}><img src={card.image} alt="" draggable="false" /><span className={`match-kind ${card.kind}`}>{matched ? `✓ ${card.letter}` : kind}</span></span></span>
        </button>
      })}
    </div>
    <p className="match-tip">ค่อย ๆ สังเกตรูปร่างและเส้นของตัวอักษร ไม่ต้องรีบ จับคู่ผิดก็ลองใหม่ได้</p>

    <details className="match-reference"><summary>ดูตารางตัวอักษร · ทบทวนก่อนเล่น <span>＋</span></summary><p>ซ้ายคือลายสือไทย ขวาคืออักษรปัจจุบัน ตัว ฐ มีรูปให้ฝึก 2 แบบ โดยสุ่มใช้หนึ่งแบบในแต่ละรอบ</p><div className="match-reference-grid">{letterPairs.map(pair => <div className="match-reference-pair" key={pair.id}><strong>{pair.letter}</strong><div>{pair.ancient.map(number => <img key={number} src={cardImage(number)} alt={`ลายสือไทย ตัว ${pair.letter}`} loading="lazy" />)}<span aria-hidden="true">↔</span><img src={cardImage(pair.modern)} alt={`ตัว ${pair.letter} ปัจจุบัน`} loading="lazy" /></div></div>)}</div><p>ชุดภาพที่ได้รับใช้ขีดแทนอักษรโบราณของ ฌ ฑ ฒ ฬ และ ฮ จึงยังไม่นำ 5 ตัวนี้มาใช้ในเกม</p></details>
  </section>
}
