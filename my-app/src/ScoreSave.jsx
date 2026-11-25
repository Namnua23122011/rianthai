import { useEffect, useState } from 'react'
import { saveQuizAttempt } from './scoreDatabase'
import { thaiNumber } from './format'

export default function ScoreSave({ attempt }) {
  const [retry, setRetry] = useState(0)
  const [status, setStatus] = useState('saving')
  const [record, setRecord] = useState(null)
  useEffect(() => {
    let active = true
    setStatus('saving')
    saveQuizAttempt(attempt).then(data => {
      if (active) { setRecord(data); setStatus('saved') }
    }).catch(() => { if (active) setStatus('error') })
    return () => { active = false }
  }, [attempt, retry])
  return <div className="score-save">
    <p role="status">{status === 'saving' ? 'กำลังบันทึกคะแนน…' : status === 'saved' ? `บันทึกคะแนนแล้ว · ${thaiNumber(record.score)} / ${thaiNumber(record.total)} คะแนน` : 'ยังบันทึกคะแนนไม่ได้ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่ก่อนเปลี่ยนบทหรือปิดหน้านี้'}</p>
    {status === 'error' && <button className="secondary-button" onClick={() => setRetry(n => n + 1)}>ลองบันทึกอีกครั้ง</button>}
  </div>
}
