import { useEffect, useRef, useState } from 'react'
import { questionSets, scoreAnswers } from './questionSets'
import { thaiNumber } from './format'
import './QuestionPage.css'

const letters = ['ก', 'ข', 'ค', 'ง']

export default function QuestionPage() {
  const set = questionSets[0]
  const [answers, setAnswers] = useState([])
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const [finished, setFinished] = useState(false)
  const heading = useRef(null)
  const question = set.questions[page]
  useEffect(() => { heading.current?.focus() }, [page, finished])

  function check() {
    if (selected === null || checked) return
    setAnswers(previous => { const next = [...previous]; next[page] = selected; return next })
    setChecked(true)
  }
  function next() {
    if (!checked) return
    if (page === set.questions.length - 1) setFinished(true)
    else { setPage(n => n + 1); setSelected(null); setChecked(false) }
  }
  function restart() { setAnswers([]); setPage(0); setSelected(null); setChecked(false); setFinished(false) }

  return <section className="question-page" aria-label="แบบฝึกหัดชุดที่หนึ่ง">
    <div className="page-heading"><div><p className="eyebrow">แบบฝึกหัดชุดที่ ๑ · ฝึกคิด สืบสานภาษา</p><h1>{set.title}</h1><p>เลือกคำตอบที่ถูกต้องที่สุด แล้วกดตรวจคำตอบ</p></div></div>
    {finished ? <section className="question-sheet">
      <h2 ref={heading} tabIndex={-1}>ผลการทำแบบฝึกหัด</h2>
      <p className="question-score">{thaiNumber(scoreAnswers(set.questions, answers))} / {thaiNumber(set.questions.length)} คะแนน</p>
      <p>ทบทวนคำตอบ แล้วฝึกใหม่ได้เสมอ</p>
      <ol className="question-review">{set.questions.map((item, index) => <li key={item.prompt}>
        <h3>ข้อ {thaiNumber(index + 1)}. {item.prompt}</h3>
        <p>{answers[index] === item.answer ? 'ถูกต้อง' : 'ยังไม่ถูกต้อง'} · คำตอบของคุณ: {letters[answers[index]]}. {item.options[answers[index]]}</p>
        <p className="review-answer">เฉลย: {letters[item.answer]}. {item.options[item.answer]}</p>
      </li>)}</ol>
      <button className="primary-button" onClick={restart}>ทำแบบฝึกหัดอีกครั้ง</button>
    </section> : <section className="question-sheet">
      <p className="eyebrow">ข้อ {thaiNumber(page + 1)} จาก {thaiNumber(set.questions.length)}</p>
      <progress className="question-progress" value={answers.length} max={set.questions.length} aria-label="จำนวนข้อที่ตอบแล้ว" />
      <h2 className="quiz-question" ref={heading} tabIndex={-1}>{question.prompt}</h2>
      <div className="answers" role="group" aria-label="ตัวเลือกคำตอบ">{question.options.map((option, index) => <button key={option} disabled={checked} aria-pressed={selected === index} className={`answer ${selected === index ? 'question-selected' : ''} ${checked && index === question.answer ? 'correct' : checked && selected === index ? 'incorrect' : ''}`} onClick={() => setSelected(index)}><span>{letters[index]}</span>{option}</button>)}</div>
      {checked && <p className="feedback" role="status">{selected === question.answer ? 'ถูกต้อง!' : 'ยังไม่ถูกต้อง'} เฉลย: {letters[question.answer]}. {question.options[question.answer]}</p>}
      <div className="question-actions">{checked ? <button className="primary-button" onClick={next}>{page === set.questions.length - 1 ? 'ดูผลคะแนน' : 'ข้อต่อไป'}</button> : <button className="primary-button" disabled={selected === null} onClick={check}>ตรวจคำตอบ</button>}</div>
    </section>}
  </section>
}
