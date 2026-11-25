import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const client = url && key ? createClient(url, key, {
  auth: { storageKey: 'rianthai-guest-session', detectSessionInUrl: false },
}) : null
let sessionRequest

async function guestSession() {
  if (!client) throw new Error('Database is not configured')
  if (!sessionRequest) {
    sessionRequest = (async () => {
      const { data, error } = await client.auth.getSession()
      if (error) throw error
      if (data.session) return data.session
      const result = await client.auth.signInAnonymously()
      if (result.error) throw result.error
      return result.data.session
    })().finally(() => { sessionRequest = null })
  }
  return sessionRequest
}

export async function saveQuizAttempt(attempt) {
  await guestSession()
  const { data, error } = await client.rpc('submit_quiz_attempt', {
    p_id: attempt.id, p_chapter_id: attempt.chapterId, p_answers: attempt.answers,
  })
  if (error) throw error
  return data
}
