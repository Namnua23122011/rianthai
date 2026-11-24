import { useState } from 'react'
import { thaiNumber } from './format'
import './SlideLesson.css'

export default function SlideLesson({ level, chapter, title, onComplete, onContinue, onClose }) {
  const [page, setPage] = useState(0)
  const [loadedPage, setLoadedPage] = useState(null)
  const [visited, setVisited] = useState(() => new Set())
  const [failed, setFailed] = useState(false)
  const [retry, setRetry] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [finished, setFinished] = useState(false)
  const slide = level.slides[page]
  const total = level.slides.length
  const ready = loadedPage === page && !failed
  const last = page === total - 1

  function goTo(nextPage) {
    setPage(nextPage)
    setLoadedPage(null)
    setFailed(false)
    setZoomed(false)
  }

  return <section className="slide-lesson" aria-label="สไลด์บทเรียน">
    <header className="slide-heading"><div className="eyebrow">บทที่ {thaiNumber(chapter)} · สไลด์ประกอบการเรียนรู้</div><h2>{title}</h2></header>
    <div className="slide-toolbar"><p aria-live="polite">หน้า {thaiNumber(page + 1)} จาก {thaiNumber(total)} · {slide.title}</p><button className="secondary-button" disabled={!ready} aria-pressed={zoomed} onClick={() => setZoomed(value => !value)}>{zoomed ? 'พอดีหน้าจอ' : 'ขยายสไลด์'}</button></div>
    <div className={`slide-stage ${zoomed ? 'is-zoomed' : ''}`} tabIndex={zoomed ? 0 : undefined} role="region" aria-label="ภาพสไลด์ เลื่อนดูภาพได้เมื่อขยาย" aria-busy={!ready && !failed}>
      {!ready && !failed && <p className="slide-loading" role="status">กำลังเปิดสไลด์…</p>}
      {failed ? <div className="slide-error" role="alert"><p>ยังเปิดสไลด์หน้านี้ไม่ได้ กรุณาลองอีกครั้ง</p><button className="secondary-button" onClick={() => { setRetry(value => value + 1); setFailed(false) }}>ลองเปิดอีกครั้ง</button></div> :
        <img key={`${page}-${retry}`} src={slide.image} width="1920" height="1080" alt={`สไลด์หน้า ${thaiNumber(page + 1)}: ${slide.title}`} onLoad={() => { setLoadedPage(page); setVisited(previous => new Set([...previous, page])) }} onError={() => setFailed(true)} />}
    </div>
    {zoomed && <p className="slide-hint">เลื่อนภาพในกรอบเพื่ออ่านข้อความที่ขยาย</p>}
    <div className="slide-progress" role="progressbar" aria-label="จำนวนสไลด์ที่เปิดดูแล้ว" aria-valuemin={0} aria-valuemax={total} aria-valuenow={visited.size}><span style={{ width: `${visited.size / total * 100}%` }} /></div>
    {finished ? <div className="slide-finished"><p role="status">เรียนครบทุกหน้าแล้ว ได้รับตรา{level.badge}และ {thaiNumber(level.xp)} แต้ม โดยรับแต้มได้ครั้งเดียวต่อบทเรียน</p><div className="dialog-actions"><button className="secondary-button" onClick={onClose}>กลับสู่บทเรียน</button>{onContinue && <button className="primary-button" onClick={onContinue}>เรียนบทถัดไป</button>}</div></div> :
      <div className="slide-controls"><button className="secondary-button" disabled={page === 0} onClick={() => goTo(page - 1)}>หน้าก่อนหน้า</button><span>เปิดดูแล้ว {thaiNumber(visited.size)} / {thaiNumber(total)} หน้า</span>{last ? <button className="primary-button" disabled={!ready || visited.size !== total} onClick={() => { onComplete(); setFinished(true) }}>เรียนจบบทนี้</button> : <button className="primary-button" disabled={!ready} onClick={() => goTo(page + 1)}>หน้าถัดไป</button>}</div>}
  </section>
}
