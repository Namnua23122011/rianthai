import { thaiLetterSlides } from './thaiLetterSlides.js'
import { thaiHistorySlides } from './thaiHistorySlides.js'

// Quiz answers use the zero-based correct option index.
export const levels = [
  { id: 'discover', type: 'slideshow', title: 'ความเป็นมาของภาษาไทย,ผู้ที่สร้างและส่งเสิรมภาษาไทย', description: 'เรียนรู้ผ่านสไลด์เรื่องพัฒนาการและผู้ส่งเสริมภาษาไทย', difficulty: 'ขั้นต้น', color: 'red', icon: 'book', xp: 100, badge: 'ผู้สืบสานภาษา', slides: thaiHistorySlides },
  { id: 'practice', type: 'slideshow', title: 'ลักษณะตัวอักษรไทยในอดีตกับปัจจุบัน,แนวทางการอณุรักษ์ตัวอักษรไทย', description: 'เปรียบเทียบอักษรไทยและเรียนรู้แนวทางการอนุรักษ์', difficulty: 'ขั้นกลาง', color: 'gold', icon: 'book', xp: 200, badge: 'ผู้หมั่นฝึกฝน', slides: thaiLetterSlides },
  { id: 'master', title: 'ต่อยอดสู่ปัญญา', description: 'ประยุกต์ความรู้และสะท้อนสิ่งที่ได้เรียน', difficulty: 'ขั้นสูง', color: 'green', icon: 'trophy', xp: 300, badge: 'ผู้รอบรู้', questions: [
    { prompt: 'จะทดสอบความเข้าใจอย่างลึกซึ้งได้อย่างไร?', options: ['นำความรู้ไปใช้ในสถานการณ์ใหม่', 'อ่านชื่อเรื่องซ้ำ ๆ', 'ข้ามคำอธิบาย'], answer: 0, explanation: 'การนำความรู้ไปใช้ในสถานการณ์ใหม่ช่วยทดสอบว่าเราเข้าใจและประยุกต์ใช้ได้จริง' },
    { prompt: 'คำอธิบายที่ชัดเจนควรมีสิ่งใด?', options: ['เฉพาะคำตอบสุดท้าย', 'เหตุผลที่นำไปสู่คำตอบ', 'คำยาว ๆ ให้มากที่สุด'], answer: 1, explanation: 'การอธิบายเหตุผลทำให้ผู้อื่นเข้าใจว่าเราได้ข้อสรุปนั้นมาอย่างไร' },
    { prompt: 'เมื่อทำบททดสอบเสร็จแล้ว ควรทำสิ่งใดต่อ?', options: ['ลืมประสบการณ์ที่ผ่านมา', 'ไม่ฝึกฝนอีกเลย', 'ทบทวนสิ่งที่ได้เรียนรู้'], answer: 2, explanation: 'การทบทวนสิ่งที่ได้เรียนรู้ช่วยให้เห็นพัฒนาการและวางเป้าหมายครั้งต่อไป' },
  ] },
]
