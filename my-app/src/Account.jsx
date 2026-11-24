import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import App from './App'
import { supabase } from './supabase'
import { authMessage, createSaveQueue, emptyRecord, validRecord } from './accountData'
import './Account.css'

function Frame({ children }) {
  return <main className="account-page"><section className="account-card"><p className="eyebrow">สืบสานมรดกแห่งภาษา</p><h1>เรือนเรียนไทย</h1><div className="account-ornament" aria-hidden="true">✦ ── ◇ ── ✦</div>{children}</section></main>
}

function AuthForm({ recovery, onRecovered }) {
  const [mode, setMode] = useState(recovery ? 'update' : 'login')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const titles = { login: 'เข้าสู่ระบบ', signup: 'สมัครสมาชิก', reset: 'ขอเปลี่ยนรหัสผ่าน', update: 'ตั้งรหัสผ่านใหม่' }
  async function submit(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const email = String(fields.get('email') || '').trim()
    const password = String(fields.get('password') || '')
    setError(''); setMessage('')
    if (['signup', 'update'].includes(mode) && password !== fields.get('confirm')) {
      setError('รหัสผ่านทั้งสองช่องไม่ตรงกัน'); return
    }
    setBusy(true)
    try {
      const redirectTo = window.location.origin + window.location.pathname
      let result
      if (mode === 'login') result = await supabase.auth.signInWithPassword({ email, password })
      if (mode === 'signup') result = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo, data: { display_name: String(fields.get('name')).trim() } } })
      if (mode === 'reset') result = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (mode === 'update') result = await supabase.auth.updateUser({ password })
      if (result.error) throw result.error
      if (mode === 'signup' && !result.data.session) setMessage('กรุณาตรวจสอบอีเมลและกดลิงก์ยืนยันบัญชี แล้วกลับมาเข้าสู่ระบบ')
      if (mode === 'reset') setMessage('หากมีบัญชีนี้ในระบบ คุณจะได้รับอีเมลพร้อมลิงก์ตั้งรหัสผ่านใหม่')
      if (mode === 'update') onRecovered()
    } catch (err) { setError(authMessage(err)) }
    finally { setBusy(false) }
  }
  function switchMode(next) { setMode(next); setError(''); setMessage('') }
  return <Frame><h2>{titles[mode]}</h2><p>เก็บบันทึกการเรียนรู้ แล้วกลับมาเรียนต่อได้ทุกที่</p>
    <form key={mode} onSubmit={submit} className="account-form">
      {mode === 'signup' && <label>ชื่อที่ใช้แสดง<input name="name" autoComplete="nickname" required maxLength={60} /></label>}
      {mode !== 'update' && <label>อีเมล<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>}
      {mode !== 'reset' && <label>รหัสผ่าน<input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'login' ? 1 : 8} required />{mode !== 'login' && <small>อย่างน้อย ๘ ตัวอักษร</small>}</label>}
      {['signup', 'update'].includes(mode) && <label>ยืนยันรหัสผ่าน<input name="confirm" type="password" autoComplete="new-password" minLength={8} required /></label>}
      {error && <p role="alert" className="account-error">{error}</p>}
      {message && <p role="status" className="account-message">{message}</p>}
      <button className="primary-button" disabled={busy || !supabase}>{busy ? 'กำลังดำเนินการ…' : titles[mode]}</button>
    </form>
    {mode !== 'update' && <div className="account-links"><button disabled={busy} onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'ยังไม่มีบัญชี · สมัครสมาชิก' : 'กลับไปเข้าสู่ระบบ'}</button>{mode === 'login' && <button disabled={busy} onClick={() => switchMode('reset')}>ลืมรหัสผ่าน</button>}</div>}
    {!supabase && <p className="account-message" role="status">ระบบสมาชิกอยู่ระหว่างการตั้งค่า กรุณากลับมาใหม่ภายหลัง</p>}
  </Frame>
}

function Learner({ user, onSignOut }) {
  const [record, setRecord] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState('')
  const [failed, setFailed] = useState(false)
  const latest = useRef(null)
  const revision = useRef(0)
  const queue = useMemo(() => createSaveQueue(async value => {
    const { error } = await supabase.from('learning_records').upsert({ user_id: user.id, ...value }, { onConflict: 'user_id' })
    if (error) throw error
  }), [user.id])
  useEffect(() => {
    let active = true
    setLoadError(false)
    async function load() {
      try {
        const { data, error } = await supabase.from('learning_records').select('progress, topics').eq('user_id', user.id).maybeSingle()
        if (error || (data && !validRecord(data))) throw error || new Error('Invalid record')
        if (active) setRecord(data ?? emptyRecord())
      } catch { if (active) setLoadError(true) }
    }
    load()
    return () => { active = false }
  }, [user.id, attempt])
  const save = useCallback(value => {
    latest.current = value
    const version = ++revision.current
    setStatus('กำลังบันทึก…'); setFailed(false)
    queue(value).then(() => {
      if (version === revision.current) setStatus('บันทึกข้อมูลแล้ว')
    }).catch(() => {
      if (version === revision.current) { setFailed(true); setStatus('ยังบันทึกไม่สำเร็จ กรุณาลองใหม่ก่อนออกจากหน้านี้') }
    })
  }, [queue])
  useEffect(() => {
    function warn(event) { if (status === 'กำลังบันทึก…' || failed) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [status, failed])
  if (!record) return <Frame><p role={loadError ? 'alert' : 'status'}>{loadError ? 'โหลดข้อมูลการเรียนไม่สำเร็จ กรุณาลองอีกครั้ง' : 'กำลังเปิดบันทึกการเรียนรู้…'}</p>{loadError && <button className="primary-button" onClick={() => setAttempt(n => n + 1)}>ลองอีกครั้ง</button>}<button className="account-text-button" onClick={onSignOut}>ออกจากระบบ</button></Frame>
  return <App initialRecord={record} onSave={save} account={{ name: user.user_metadata?.display_name || 'ผู้ใฝ่เรียนรู้', onSignOut, status, failed, retry: () => save(latest.current), saving: status === 'กำลังบันทึก…' }} />
}

export default function Account() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  const [recovery, setRecovery] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery')
  const [error, setError] = useState('')
  useEffect(() => {
    if (!supabase) return
    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, value) => {
      if (!active) return
      setSession(value); setLoading(false)
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
    })
    supabase.auth.getSession().then(({ error: err }) => {
      if (active && err) { setError(authMessage(err)); setLoading(false) }
    }).catch(() => { if (active) { setError('เชื่อมต่อระบบสมาชิกไม่สำเร็จ กรุณาโหลดหน้าใหม่'); setLoading(false) } })
    return () => { active = false; subscription.unsubscribe() }
  }, [])
  async function signOut() {
    setError('')
    try {
      const { error: err } = await supabase.auth.signOut({ scope: 'local' })
      if (err) throw err
      setSession(null); setRecovery(false)
    } catch (err) { setError(authMessage(err)) }
  }
  if (loading) return <Frame><p role="status">กำลังตรวจสอบบัญชี…</p></Frame>
  return <>{error && <p className="account-global-error" role="alert">{error}</p>}{recovery && session ? <AuthForm key="recovery" recovery onRecovered={() => setRecovery(false)} /> : session ? <Learner key={session.user.id} user={session.user} onSignOut={signOut} /> : <AuthForm key="auth" />}</>
}
