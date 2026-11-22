import { useEffect, useRef, useState } from 'react'
import { levels } from './learning'
import MatchingGame from './MatchingGame'
import { cardBack } from './matchingCards'

function saved(key, fallback, check) {
  try { const value = JSON.parse(localStorage.getItem(key)); return check(value) ? value : fallback } catch { return fallback }
}
function Icon({ name, size = 22 }) {
  const paths = { grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z', book: 'M12 5v16 M12 5C8 2 4 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-2-1-6-2-10 1Z', trophy: 'M8 3h8v8a4 4 0 0 1-8 0Z M8 5H3v3a5 5 0 0 0 5 5 M16 5h5v3a5 5 0 0 1-5 5 M12 15v6 M8 21h8', arrow: 'M5 12h14 M13 6l6 6-6 6', star: 'm12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z', lock: 'M6 10h12v11H6z M8 10V6a4 4 0 0 1 8 0v4', check: 'm5 12 4 4L19 6', bolt: 'm13 2-9 12h7l-1 8 10-13h-8Z', leaf: 'M19 3C5 2 2 8 6 15s15 4 13-12Z M5 21 15 9', mountain: 'm2 20 8-16 5 10 3-5 4 11Z M7 10l3 2 3-2', flag: 'M5 22V3 M5 3c5-5 9 5 15 0v10c-6 5-10-5-15 0', edit: 'm4 16 12-12 4 4L8 20H4Z M13 7l4 4', close: 'm6 6 12 12 M18 6 6 18' }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.star} /></svg>
}
export default function App() {
  const [progress, setProgress] = useState(() => saved('studyquest-progress', levels.map(() => 0), v => Array.isArray(v) && v.length === levels.length && v.every((n, i) => Number.isInteger(n) && n >= 0 && n <= levels[i].questions.length)))
  const [topics, setTopics] = useState(() => saved('studyquest-topics', ['', '', ''], v => Array.isArray(v) && v.length === 3 && v.every(s => typeof s === 'string')))
  const [tab, setTab] = useState('Dashboard')
  const [game, setGame] = useState(null)
  const [editor, setEditor] = useState(false)
  const [notice, setNotice] = useState('')
  const dialog = useRef(null)
  const isComplete = i => progress[i] === levels[i].questions.length
  const completed = progress.filter((_, i) => isComplete(i)).length
  const xp = progress.reduce((sum, _, i) => sum + (isComplete(i) ? levels[i].xp : 0), 0)
  const current = completed === levels.length ? levels.length - 1 : levels.findIndex((_, i) => !isComplete(i))
  const percent = Math.round(completed / 3 * 100)
  useEffect(() => { try { localStorage.setItem('studyquest-progress', JSON.stringify(progress)); localStorage.setItem('studyquest-topics', JSON.stringify(topics)) } catch { setNotice('Browser storage is unavailable. Changes last for this visit only.') } }, [progress, topics])
  useEffect(() => { if (game || editor) dialog.current?.showModal(); else dialog.current?.close() }, [game, editor])
  const start = i => setGame({ level: i, question: 0, selected: null, correct: 0, done: false })
  const close = () => { setGame(null); setEditor(false) }
  function next() {
    const score = game.correct + Number(game.selected === levels[game.level].questions[game.question].answer)
    if (game.question === levels[game.level].questions.length - 1) {
      setProgress(p => p.map((n, i) => i === game.level ? Math.max(n, score) : n))
      setGame({ ...game, correct: score, done: true })
    } else setGame({ ...game, question: game.question + 1, selected: null, correct: score })
  }
  return <div className="app-shell">
    <aside className="sidebar">
      <a href="#" className="brand" aria-label="RianThai home" onClick={() => setTab('Dashboard')}><span className="brand-icon"><Icon name="bolt" /></span>Rian<span>Thai</span><span className="brand-dot">.</span></a>
      <p className="sidebar-label">เมนู</p>
      <nav className="flex flex-col gap-2" aria-label="Main navigation">{[['Dashboard', 'grid'], ['My learning', 'book'], ['Achievements', 'trophy'], ['เกมจับคู่', 'grid']].map(([name, icon]) => <button key={name} className={`nav-link ${tab === name ? 'active' : ''}`} aria-label={name} aria-current={tab === name ? 'page' : undefined} onClick={() => setTab(name)}><Icon name={icon} />{name}{name === 'My learning' && <span className="nav-count">3</span>}</button>)}</nav>
      <div className="sidebar-tip"><span className="text-3xl">✦</span><h3>Small steps. Big things.</h3><p>A little learning every day goes a long way.</p><div className="tip-line" /></div>
      <div className="profile"><div className="avatar">S</div><div><strong>Student</strong><p>Curious mind, big potential</p></div><span className="online-dot" /></div>
    </aside>
    <div className="main-shell">
      <header className="topbar"><div className="flex items-center gap-3"><span className="text-slate-400">My workspace</span><span className="text-slate-300">/</span><strong>{tab}</strong></div><div className="flex items-center gap-4"><span className="xp-pill"><Icon name="bolt" size={16} /> {xp} XP</span><div className="avatar small">S</div></div></header>
      <main>
        {tab === 'เกมจับคู่' ? <MatchingGame /> : <>
        <div className="page-heading"><div><div className="ancient-thai-text">เรียนไทยกันครับ</div><h1>{tab === 'Achievements' ? 'Every win counts.' : tab === 'My learning' ? 'เนื้อหาที่มี' : 'เนื้อหาที่มี'} <span className="wave">✦</span></h1><p>Your pace. Your path. A little closer to your goals.</p></div><button className="secondary-button" onClick={() => setEditor(true)} aria-label="Edit topics"><Icon name="edit" size={16} />Edit topics</button></div>
        {notice && <p role="status" className="notice">{notice}</p>}
        {tab === 'Dashboard' && <>
          <section className="hero-panel"><div className="hero-content"><span className="hero-tag"><span /> YOUR LEARNING ADVENTURE</span><h2>Big dreams start<br />with a small quest.</h2><p>Explore, practice, and put your skills to the test.<br className="hidden sm:block" /> Three levels. One journey. Let’s make it yours.</p><button className="primary-button" onClick={() => start(current)}>{completed === 3 ? 'Play again' : completed ? 'Continue your journey' : 'Start your journey'}<Icon name="arrow" size={18} /></button><span className="hero-caption">A little progress is still progress.</span></div><div className="quest-art" aria-hidden="true"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="art-spark spark-one">✦</span><span className="art-spark spark-two">✧</span><div className="art-card card-back"><Icon name="book" size={50} /></div><div className="art-card card-front"><div className="trophy-circle"><Icon name="trophy" size={65} /></div><div className="art-line" /><div className="art-line short" /><div className="art-stars">★ ★ ★</div></div><div className="art-badge"><span>✦</span> YOU’VE GOT THIS!</div><span className="art-spark spark-three">+</span></div></section>
          <div className="stats-grid">{[['bolt', `${xp}`, 'Total XP earned', 'Keep the momentum going', 'purple'], ['check', `${completed} / 3`, 'Levels completed', 'Every step is a win', 'green'], ['trophy', `${completed}`, 'Badges collected', 'A little proof of your progress', 'orange']].map(([icon, value, label, detail, color]) => <section className="stat-card" key={label}><span className={`stat-icon ${color}`}><Icon name={icon} /></span><div><span className="stat-label">{label}</span><h3>{value}<span>{icon === 'bolt' ? ' XP' : ''}</span></h3><p>{detail}</p></div></section>)}</div>
        </>}
        {tab === 'Dashboard' && <section className="match-entry"><img src={cardBack} alt="การ์ดพ่อขุนรามคำแหง" /><div><h2>จับคู่ลายสือไทย</h2><p>รู้จักอักษรพ่อขุนรามคำแหงผ่านเกมเปิดการ์ด</p></div><button className="match-action" onClick={() => setTab('เกมจับคู่')}>เล่นเกมจับคู่ →</button></section>}
        <div className="content-grid"><section><div className="section-heading"><div><h2>{tab === 'Achievements' ? 'Your badge collection' : 'Choose your challenge'}</h2><p>{tab === 'Achievements' ? 'Complete a level to earn a badge of your own.' : 'Build your confidence, one level at a time.'}</p></div><span className="subtle-tag">3 LEVELS</span></div>
          <div className="level-list">{levels.map((level, i) => { const locked = i > 0 && !isComplete(i - 1); const done = isComplete(i); return <article key={level.id} className={`level-card ${level.color} ${locked ? 'locked' : ''}`}><div className="level-illustration"><Icon name={level.icon} size={38} /><span className="mini-spark">✦</span></div><div className="level-details"><div className="flex items-center gap-2"><span className="level-number">LEVEL 0{i + 1}</span><span className="difficulty">{level.difficulty}</span></div><h3>{tab === 'Achievements' ? level.badge : level.title}</h3><p>{topics[i] || 'Your topic goes here'}{!topics[i] && <span className="demo-label"> · Demo quiz</span>}</p><div className="level-meta"><span><Icon name="book" size={13} />{level.questions.length} questions</span><span><Icon name="bolt" size={13} />{level.xp} XP</span></div></div>{tab === 'Achievements' ? <span className={`status-badge ${done ? 'earned' : ''}`}>{done ? '✓ Earned' : 'Not earned yet'}</span> : <button disabled={locked} className={`level-action ${done ? 'complete' : ''}`} onClick={() => start(i)} aria-label={`${locked ? 'Locked' : done ? 'Replay' : 'Start'} level ${i + 1}`}><Icon name={locked ? 'lock' : done ? 'check' : 'arrow'} size={20} /></button>}<span className="level-bottom">{done ? 'Completed · replay anytime' : locked ? `Complete level ${i} to unlock` : 'Ready when you are'}</span></article> })}</div>
        </section><aside className="journey-panel"><div className="flex items-center justify-between"><h2>Your journey</h2><Icon name="flag" size={18} /></div><p>A brighter mind, one quest at a time.</p><div className="progress-ring" style={{ '--progress': `${percent}%` }}><div><strong>{percent}<span>%</span></strong><span>complete</span></div></div><h3>{completed === 3 ? 'Look how far you’ve come!' : completed ? 'Keep up the great work' : 'You’re just getting started'}</h3><p>{completed === 3 ? 'All three levels conquered. Replay to keep your skills fresh.' : 'Finish each level to unlock the next chapter of your adventure.'}</p><div className="journey-steps">{levels.map((level, i) => <div key={level.id} className={`journey-step ${isComplete(i) ? 'done' : ''}`}><span>{isComplete(i) ? '✓' : i + 1}</span><div><strong>{level.title}</strong><p>{isComplete(i) ? 'Completed' : i === current ? 'Your next step' : 'Coming up next'}</p></div></div>)}</div><div className="journey-note"><Icon name="leaf" size={18} /><span>Learning is a journey.<br />Enjoy every little discovery.</span></div></aside></div>
        <footer><span>Made for curious minds.</span><span>Keep learning. Keep growing. <span className="text-violet-500">✦</span></span></footer>
        </>}
      </main>
    </div>
    <dialog ref={dialog} onCancel={close} className="quest-dialog" aria-label={editor ? 'Edit topics' : 'Study quiz'}><button className="close-button" onClick={close} aria-label="Close dialog"><Icon name="close" /></button>
      {editor && <form onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); setTopics(levels.map((_, i) => String(data.get(`topic-${i}`)).trim())); setEditor(false); setNotice('Topic titles saved. Questions are still demo content until you replace them.') }}><div className="eyebrow">MAKE IT YOURS</div><h2>Add your topics</h2><p>Name each level now. Demo questions will stay in place until your lesson content is added.</p>{levels.map((level, i) => <label className="topic-field" key={level.id}>Level {i + 1} · {level.title}<input name={`topic-${i}`} defaultValue={topics[i]} maxLength={80} placeholder="e.g. Introduction to your topic" /></label>)}<button className="primary-button mt-6" type="submit">Save topics<Icon name="check" size={18} /></button></form>}
      {game && (() => { const level = levels[game.level]; const question = level.questions[game.question]; const totalQuestions = level.questions.length; const passed = game.correct === totalQuestions; return game.done ? <div className="text-center py-4"><div className="result-icon"><Icon name={passed ? 'trophy' : 'leaf'} size={48} /></div><h2>{passed ? 'Quest complete!' : 'You’re making progress!'}</h2><p>You answered {game.correct} of {totalQuestions} questions correctly.</p><p>{passed ? `${level.badge} earned. ${level.xp} XP awarded once per level.` : 'Get every question right to complete this level. Give it another go!'}</p><div className="flex justify-center gap-3 mt-6"><button className="secondary-button" onClick={close}>Dashboard</button><button className="primary-button" onClick={() => passed && game.level < 2 ? start(game.level + 1) : start(game.level)}>{passed && game.level < 2 ? 'Next level' : 'Play again'}<Icon name="arrow" size={18} /></button></div></div> : <div><div className="eyebrow">LEVEL {game.level + 1} · DEMO QUIZ</div><h2>{topics[game.level] || level.title}</h2><div className="quiz-progress"><span style={{ width: `${(game.question + 1) / totalQuestions * 100}%` }} /></div><p className="mb-4">Question {game.question + 1} of {totalQuestions}</p><h3 className="quiz-question">{question.prompt}</h3><div className="answers">{question.options.map((option, i) => <button key={option} disabled={game.selected !== null} className={`answer ${game.selected !== null && i === question.answer ? 'correct' : game.selected === i ? 'incorrect' : ''}`} onClick={() => setGame({ ...game, selected: i })}><span>{String.fromCharCode(65 + i)}</span>{option}</button>)}</div>{game.selected !== null && <p className="feedback" role="status">{game.selected === question.answer ? 'Correct! ' : 'Not quite. '}{question.explanation}</p>}<button className="primary-button mt-6" disabled={game.selected === null} onClick={next}>{game.question === totalQuestions - 1 ? 'See results' : 'Next question'}<Icon name="arrow" size={18} /></button></div> })()}
    </dialog>
  </div>
}


