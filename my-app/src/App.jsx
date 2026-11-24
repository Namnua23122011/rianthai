import { useEffect, useRef, useState } from 'react'
import { levels } from './learning'
import MatchingGame from './MatchingGame'
import { cardBack } from './matchingCards'
import { thaiNumber } from './format'
import SlideLesson from './SlideLesson'
import { completionTarget, isValidProgress, migrateLegacyProgress, progressStorageKey, topicsStorageKey } from './learningProgress'

const navigation = [
  { id: 'dashboard', label: 'หน้าหลัก', icon: 'home' },
  { id: 'learning', label: 'บทเรียนของฉัน', shortLabel: 'บทเรียน', icon: 'book' },
  { id: 'matching', label: 'จับคู่ลายสือไทย', shortLabel: 'เกมจับคู่', icon: 'grid' },
  { id: 'achievements', label: 'เกียรติยศ', icon: 'trophy' },
]

function saved(key, fallback, check) {
  try { const value = JSON.parse(localStorage.getItem(key)); return check(value) ? value : fallback } catch { return fallback }
}

function Icon({ name, size = 22 }) {
  const paths = {
    home: 'm3 10 9-7 9 7 M5 9v12h14V9 M9 21v-8h6v8',
    grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    book: 'M12 5v16 M12 5C8 2 4 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-2-1-6-2-10 1Z',
    trophy: 'M8 3h8v8a4 4 0 0 1-8 0Z M8 5H3v3a5 5 0 0 0 5 5 M16 5h5v3a5 5 0 0 1-5 5 M12 15v6 M8 21h8',
    star: 'm12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z',
    lock: 'M6 10h12v11H6z M8 10V6a4 4 0 0 1 8 0v4',
    check: 'm5 12 4 4L19 6',
    leaf: 'M19 3C5 2 2 8 6 15s15 4 13-12Z M5 21 15 9',
    mountain: 'm2 20 8-16 5 10 3-5 4 11Z M7 10l3 2 3-2',
    flag: 'M5 22V3 M5 3c5-5 9 5 15 0v10c-6 5-10-5-15 0',
    edit: 'm4 16 12-12 4 4L8 20H4Z M13 7l4 4',
    close: 'm6 6 12 12 M18 6 6 18',
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.star} /></svg>
}

function Lotus({ className = '' }) {
  return <svg className={className} width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M24 5c-9 9-12 17 0 28 12-11 9-19 0-28Z M24 33C9 34 4 24 5 15c11 1 16 6 19 18Z M24 33c15 1 20-9 19-18-11 1-16 6-19 18Z M24 35C12 40 4 33 2 25c9 0 17 4 22 10Z M24 35c12 5 20-2 22-10-9 0-17 4-22 10Z M12 42h24 M18 38h12" /></svg>
}

export default function App({ initialRecord, onSave, account }) {
  const [progress, setProgress] = useState(() => {
    if (initialRecord) return initialRecord.progress
    const versionThree = saved('rianthai-progress-v3', null, Array.isArray)
    const previous = versionThree ?? saved('rianthai-progress-v2', null, Array.isArray)
    return saved(progressStorageKey,
      migrateLegacyProgress(previous ?? saved('studyquest-progress', [], Array.isArray), levels, versionThree ? 3 : previous ? 2 : 1),
      value => isValidProgress(value, levels))
  })
  const [topics, setTopics] = useState(() => {
    if (initialRecord) return initialRecord.topics
    const validTopics = value => Array.isArray(value) && value.length === levels.length && value.every(topic => typeof topic === 'string')
    const legacyTopics = saved('rianthai-topics-v3', saved('rianthai-topics-v2', saved('studyquest-topics', levels.map(() => ''), validTopics), validTopics), validTopics)
    return saved(topicsStorageKey, legacyTopics.map((topic, i) => i === 2 ? '' : topic), validTopics)
  })
  const [tab, setTab] = useState('dashboard')
  const [game, setGame] = useState(null)
  const [editor, setEditor] = useState(false)
  const [notice, setNotice] = useState('')
  const dialog = useRef(null)
  const isComplete = i => progress[i] === completionTarget(levels[i])
  const completed = progress.filter((_, i) => isComplete(i)).length
  const xp = progress.reduce((sum, _, i) => sum + (isComplete(i) ? levels[i].xp : 0), 0)
  const current = completed === levels.length ? levels.length - 1 : levels.findIndex((_, i) => !isComplete(i))
  const percent = Math.round(completed / levels.length * 100)
  const activePage = navigation.find(item => item.id === tab)

  useEffect(() => {
    if (onSave) { onSave({ progress, topics }); return }
    try {
      localStorage.setItem(progressStorageKey, JSON.stringify(progress))
      localStorage.setItem(topicsStorageKey, JSON.stringify(topics))
    } catch { setNotice('ไม่สามารถบันทึกข้อมูลในเบราว์เซอร์ได้ การเปลี่ยนแปลงจะคงอยู่เฉพาะการใช้งานครั้งนี้') }
  }, [progress, topics, onSave])
  useEffect(() => { if (game || editor) dialog.current?.showModal(); else dialog.current?.close() }, [game, editor])

  const start = i => setGame(levels[i].type === 'slideshow' ? { level: i } : { level: i, question: 0, selected: null, correct: 0, done: false })
  const close = () => { setGame(null); setEditor(false) }
  function next() {
    const score = game.correct + Number(game.selected === levels[game.level].questions[game.question].answer)
    if (game.question === levels[game.level].questions.length - 1) {
      setProgress(p => p.map((n, i) => i === game.level ? Math.max(n, score) : n))
      setGame({ ...game, correct: score, done: true })
    } else setGame({ ...game, question: game.question + 1, selected: null, correct: score })
  }

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">ข้ามไปยังเนื้อหา</a>
    <aside className="sidebar">
      <a href="#main-content" className="brand" aria-label="เรียนไทย หน้าหลัก" onClick={() => setTab('dashboard')}>
        <span className="brand-icon"><Lotus /></span><span className="brand-name">เรียนไทย<small>สืบสานลายสือไทย</small></span>
      </a>
      <div className="sidebar-divider" aria-hidden="true"><span>✦</span></div>
      <p className="sidebar-label">สำรับการเรียนรู้</p>
      <nav aria-label="เมนูหลัก">{navigation.map(({ id, label, shortLabel, icon }) =>
        <button key={id} className={`nav-link ${tab === id ? 'active' : ''}`} aria-label={label} aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id)}>
          <Icon name={icon} /><span className="nav-label-full">{label}</span><span className="nav-label-short" aria-hidden="true">{shortLabel || label}</span>{id === 'learning' && <span className="nav-count">{thaiNumber(levels.length)}</span>}
        </button>
      )}</nav>
      <div className="sidebar-tip"><Lotus /><h3>รากภาษา รากของเรา</h3><p>เรียนรู้วันละนิด<br />สืบสานภาษาไทยให้ยั่งยืน</p><span className="tip-ornament" aria-hidden="true">◇</span></div>
      <div className="profile"><div className="avatar">ศ</div><div className="account-profile"><strong>{account?.name || 'ผู้ใฝ่เรียนรู้'}</strong>{account && <><small role="status">{account.status}</small>{account.failed && <button onClick={account.retry}>ลองบันทึกอีกครั้ง</button>}<button onClick={account.onSignOut} disabled={account.saving || account.failed}>ออกจากระบบ</button></>}</div></div>
    </aside>

    <div className="main-shell">
      <header className="topbar"><div className="breadcrumb"><span>เรือนการเรียนรู้</span><span aria-hidden="true">/</span><strong>{activePage.label}</strong></div><span className="xp-pill"><Icon name="star" size={17} /> {thaiNumber(xp)} แต้ม</span></header>
      <main id="main-content" tabIndex={-1}>
        {notice && <p role="status" className="notice">{notice}</p>}
        {tab === 'matching' ? <MatchingGame /> : <>
          <div className="page-heading"><div><p className="eyebrow">มรดกอักษร สู่การเรียนรู้วันนี้</p><h1>{tab === 'achievements' ? 'เกียรติยศแห่งการเรียนรู้' : tab === 'learning' ? 'บทเรียนของฉัน' : 'ยินดีต้อนรับสู่เรือนเรียนไทย'}</h1></div><button className="secondary-button" onClick={() => setEditor(true)}><Icon name="edit" size={16} />แก้ไขชื่อบทเรียน</button></div>

          {tab === 'dashboard' && <>
            <section className="hero-panel" aria-labelledby="hero-title">
              <div className="hero-content"><span className="hero-tag">สืบเสน่ห์ศิลป์สุโขทัย</span><h2 id="hero-title">ย้อนรอยอักษร<br /><span className="ancient-thai-text">สืบสานลายสือไทย</span></h2><div className="hero-rule" aria-hidden="true"><span>✦</span></div><p>เรียนรู้ภาษาไทย ผ่านกลิ่นอายแห่งสุโขทัย<br />ร่วมเปิดโลกตัวอักษรพ่อขุนรามคำแหงไปด้วยกัน</p><button className="primary-button" onClick={() => start(current)}><Icon name="book" size={19} />{completed === levels.length ? 'ทบทวนบทเรียน' : completed ? 'เรียนต่อจากครั้งก่อน' : 'เริ่มต้นเรียนรู้'}</button><span className="hero-caption">ค่อย ๆ เรียนรู้ ทีละอักษร ทีละเรื่องราว</span></div>
              <figure className="heritage-art"><div className="heritage-frame"><img src={cardBack} alt="พระบรมราชานุสาวรีย์พ่อขุนรามคำแหงในกรอบลายไทยสีทอง" width="571" height="800" /></div><figcaption>พ่อขุนรามคำแหงมหาราช</figcaption></figure>
              <span className="hero-corner corner-top" aria-hidden="true">❖</span><span className="hero-corner corner-bottom" aria-hidden="true">❖</span>
            </section>
            <div className="stats-grid">{[
              ['star', thaiNumber(xp), 'แต้มแห่งการเรียนรู้', 'red'],
              ['book', `${thaiNumber(completed)} / ${thaiNumber(levels.length)}`, 'บทเรียนที่สำเร็จ', 'gold'],
              ['trophy', thaiNumber(completed), 'ตราเกียรติยศ', 'green'],
            ].map(([icon, value, label, color]) => <section className="stat-card" key={label}><span className={`stat-icon ${color}`}><Icon name={icon} /></span><div><span className="stat-label">{label}</span><h3>{value}</h3></div></section>)}</div>
            <section className="match-entry"><span className="match-entry-letter ancient-thai-text" aria-hidden="true">ก</span><div><span className="entry-kicker">เรียนรู้ผ่านการเล่น</span><h2>จับคู่ลายสือไทย</h2><p>เปิดแผ่นภาพ เทียบอักษรโบราณกับอักษรไทยในวันนี้</p></div><button className="match-action" onClick={() => setTab('matching')}><Icon name="grid" size={17} />เล่นเกมจับคู่</button></section>
          </>}

          <div className="content-grid"><section aria-labelledby="lessons-title"><div className="section-heading"><div><h2 id="lessons-title">{tab === 'achievements' ? 'ทำเนียบเกียรติยศ' : 'เส้นทางการเรียนรู้'}</h2><p>{tab === 'achievements' ? 'เรียนจบแต่ละบท เพื่อรับตราแห่งความตั้งใจ' : 'บ่มเพาะความรู้ ทีละบท ทีละก้าว'}</p></div><span className="subtle-tag">{thaiNumber(levels.length)} บทเรียน</span></div>
            <div className="level-list">{levels.map((level, i) => {
              const locked = i > 0 && !isComplete(i - 1)
              const done = isComplete(i)
              return <article key={level.id} className={`level-card ${level.color} ${locked ? 'locked' : ''}`}>
                <div className="level-illustration"><Icon name={level.icon} size={32} /></div>
                <div className="level-details"><div className="level-labels"><span className="level-number">บทที่ {thaiNumber(i + 1)}</span><span className="difficulty">{level.difficulty}</span></div><h3>{tab === 'achievements' ? level.badge : topics[i] || level.title}</h3><p>{level.description}</p><div className="level-meta"><span><Icon name="book" size={15} />{level.type === 'slideshow' ? `สไลด์ ${thaiNumber(level.slides.length)} หน้า` : `${thaiNumber(level.questions.length)} ข้อ`}</span><span><Icon name="star" size={15} />{thaiNumber(level.xp)} แต้ม</span></div></div>
                {tab === 'achievements' ? <span className={`status-badge ${done ? 'earned' : ''}`}>{done ? 'ได้รับแล้ว' : 'ยังไม่ได้รับ'}</span> : <button disabled={locked} className={`level-action ${done ? 'complete' : ''}`} onClick={() => start(i)} aria-label={`${locked ? 'ยังไม่เปิด' : done ? 'ทบทวน' : 'เริ่ม'}บทที่ ${thaiNumber(i + 1)}`}><Icon name={locked ? 'lock' : done ? 'check' : 'book'} size={19} /><span>{locked ? 'รอเปิด' : done ? 'ทบทวน' : level.type === 'slideshow' ? 'ดูสไลด์' : 'เริ่มเรียน'}</span></button>}
                <span className="level-bottom">{done ? 'เรียนสำเร็จแล้ว · กลับมาทบทวนได้เสมอ' : locked ? `เรียนบทที่ ${thaiNumber(i)} ให้สำเร็จเพื่อเปิดบทนี้` : 'พร้อมให้คุณเริ่มเรียนรู้'}</span>
              </article>
            })}</div>
          </section>
          <aside className="journey-panel"><div className="journey-heading"><h2>บันทึกการเรียนรู้</h2><Icon name="flag" size={20} /></div><p>ทุกความตั้งใจ มีความหมาย</p><div className="progress-ring" role="img" aria-label={`เรียนสำเร็จร้อยละ ${thaiNumber(percent)}`} style={{ '--progress': `${percent}%` }}><div><span>สำเร็จร้อยละ</span><strong>{thaiNumber(percent)}</strong></div></div><h3>{completed === levels.length ? 'เรียนครบทุกบทแล้ว' : completed ? 'ก้าวต่อไปด้วยความตั้งใจ' : 'เริ่มก้าวแรกแห่งการเรียนรู้'}</h3><p>{completed === levels.length ? 'กลับมาทบทวน เพื่อให้ความรู้คงอยู่เสมอ' : levels[current].type === 'slideshow' ? 'เปิดดูสไลด์ให้ครบ แล้วกดเรียนจบบทนี้เพื่อเปิดบทถัดไป' : 'ตอบให้ถูกทุกข้อ เพื่อเปิดบทเรียนถัดไป'}</p><div className="journey-steps">{levels.map((level, i) => <div key={level.id} className={`journey-step ${isComplete(i) ? 'done' : ''}`}><span>{isComplete(i) ? '✓' : thaiNumber(i + 1)}</span><div><strong>{level.title}</strong><p>{isComplete(i) ? 'เรียนสำเร็จแล้ว' : i === current ? 'ก้าวถัดไปของคุณ' : 'รอการเรียนรู้'}</p></div></div>)}</div><div className="journey-note"><Lotus /><span>รักษ์ภาษา รักษ์ความเป็นไทย</span></div></aside></div>
        </>}
        <footer><span>เรียนไทย · สืบสานมรดกแห่งภาษา</span><span>เรียนรู้รากเหง้า เข้าใจวันนี้ <span aria-hidden="true">✦</span></span></footer>
      </main>
    </div>

    <dialog ref={dialog} onCancel={close} className={`quest-dialog ${game && levels[game.level].type === 'slideshow' ? 'slide-dialog' : ''}`} aria-label={editor ? 'แก้ไขชื่อบทเรียน' : game && levels[game.level].type === 'slideshow' ? 'สไลด์บทเรียน' : 'แบบทดสอบความรู้'}><button className="close-button" onClick={close} aria-label="ปิดหน้าต่าง"><Icon name="close" /></button>
      {editor && <form onSubmit={e => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        setTopics(levels.map((_, i) => String(data.get(`topic-${i}`)).trim()))
        setEditor(false)
        setNotice('บันทึกชื่อบทเรียนแล้ว เนื้อหาในแต่ละบทยังคงเดิม')
      }}><div className="eyebrow">สำรับบทเรียนของคุณ</div><h2>ตั้งชื่อบทเรียน</h2><p>ปรับชื่อบทเรียนได้ตามต้องการ โดยเนื้อหาในแต่ละบทยังคงเดิม</p>{levels.map((level, i) => <label className="topic-field" key={level.id}>บทที่ {thaiNumber(i + 1)} · {level.title}<input name={`topic-${i}`} defaultValue={topics[i]} maxLength={80} placeholder={level.title} /></label>)}<button className="primary-button dialog-submit" type="submit"><Icon name="check" size={18} />บันทึกชื่อบทเรียน</button></form>}
      {game && (() => {
        const level = levels[game.level]
        if (level.type === 'slideshow') return <SlideLesson key={level.id} level={level} chapter={game.level + 1} title={topics[game.level] || level.title} onComplete={() => setProgress(previous => previous.map((score, i) => i === game.level ? completionTarget(level) : score))} onContinue={game.level < levels.length - 1 ? () => start(game.level + 1) : undefined} onClose={close} />
        const question = level.questions[game.question]
        const totalQuestions = level.questions.length
        const passed = game.correct === totalQuestions
        return game.done ? <div className="quiz-result"><div className="result-icon"><Icon name={passed ? 'trophy' : 'leaf'} size={48} /></div><h2>{passed ? 'สำเร็จอีกหนึ่งบทเรียน' : 'เรียนรู้เพิ่มขึ้นอีกก้าว'}</h2><p>ตอบถูก {thaiNumber(game.correct)} จาก {thaiNumber(totalQuestions)} ข้อ</p><p>{passed ? `ได้รับตรา${level.badge} และ ${thaiNumber(level.xp)} แต้ม โดยรับแต้มได้ครั้งเดียวต่อบทเรียน` : 'ตอบให้ถูกทุกข้อเพื่อผ่านบทเรียน ลองทบทวนแล้วเริ่มใหม่ได้เสมอ'}</p><div className="dialog-actions"><button className="secondary-button" onClick={close}>กลับสู่บทเรียน</button><button className="primary-button" onClick={() => passed && game.level < levels.length - 1 ? start(game.level + 1) : start(game.level)}>{passed && game.level < levels.length - 1 ? 'เรียนบทถัดไป' : 'ลองอีกครั้ง'}</button></div></div> : <div><div className="eyebrow">บทที่ {thaiNumber(game.level + 1)} · แบบทดสอบความรู้</div><h2>{topics[game.level] || level.title}</h2><div className="quiz-progress"><span style={{ width: `${(game.question + 1) / totalQuestions * 100}%` }} /></div><p>ข้อที่ {thaiNumber(game.question + 1)} จาก {thaiNumber(totalQuestions)} ข้อ</p><h3 className="quiz-question">{question.prompt}</h3><div className="answers">{question.options.map((option, i) => <button key={option} disabled={game.selected !== null} className={`answer ${game.selected !== null && i === question.answer ? 'correct' : game.selected === i ? 'incorrect' : ''}`} onClick={() => setGame({ ...game, selected: i })}><span>{['ก', 'ข', 'ค', 'ง'][i]}</span>{option}</button>)}</div>{game.selected !== null && <p className="feedback" role="status">{game.selected === question.answer ? 'ถูกต้อง! ' : 'ยังไม่ถูก ลองเรียนรู้จากคำอธิบายนี้นะ '}{question.explanation}</p>}<button className="primary-button dialog-submit" disabled={game.selected === null} onClick={next}>{game.question === totalQuestions - 1 ? 'ดูผลการเรียนรู้' : 'ข้อต่อไป'}</button></div>
      })()}
    </dialog>
  </div>
}
