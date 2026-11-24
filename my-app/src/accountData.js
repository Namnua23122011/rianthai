export const emptyRecord = () => ({ progress: [0, 0, 0], topics: ['', '', ''] })

export function validRecord(value) {
  return value && Array.isArray(value.progress) && value.progress.length === 3 &&
    value.progress.every(n => n === 0 || n === 1) &&
    Array.isArray(value.topics) && value.topics.length === 3 &&
    value.topics.every(s => typeof s === 'string' && s.length <= 80)
}

// Serialize requests so a slow older save cannot overwrite a newer one.
export function createSaveQueue(write) {
  let queue = Promise.resolve()
  return value => {
    const result = queue.then(() => write(value))
    queue = result.catch(() => {})
    return result
  }
}

export function authMessage(error) {
  switch (error?.code) {
    case 'invalid_credentials': return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
    case 'email_not_confirmed': return 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ'
    case 'user_already_exists': return 'อีเมลนี้มีบัญชีแล้ว กรุณาเข้าสู่ระบบ'
    case 'weak_password': return 'กรุณาใช้รหัสผ่านที่คาดเดายากและยาวอย่างน้อย ๘ ตัวอักษร'
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit': return 'ส่งคำขอบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'
    default: return 'ไม่สามารถดำเนินการได้ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่'
  }
}
