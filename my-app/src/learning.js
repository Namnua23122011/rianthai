import { thaiAnalysisSlides } from './thaiAnalysisSlides.js'
import { thaiLetterSlides } from './thaiLetterSlides.js'
import { thaiHistorySlides } from './thaiHistorySlides.js'

// Quiz answers use the zero-based correct option index.
export const levels = [
  { id: 'discover', type: 'slideshow', title: 'ความเป็นมาของภาษาไทย,ผู้ที่สร้างและส่งเสิรมภาษาไทย', description: 'เรียนรู้ผ่านสไลด์เรื่องพัฒนาการและผู้ส่งเสริมภาษาไทย', difficulty: 'ขั้นต้น', color: 'red', icon: 'book', xp: 100, badge: 'ผู้สืบสานภาษา', slides: thaiHistorySlides },
  { id: 'practice', type: 'slideshow', title: 'ลักษณะตัวอักษรไทยในอดีตกับปัจจุบัน,แนวทางการอณุรักษ์ตัวอักษรไทย', description: 'เปรียบเทียบอักษรไทยและเรียนรู้แนวทางการอนุรักษ์', difficulty: 'ขั้นกลาง', color: 'gold', icon: 'book', xp: 200, badge: 'ผู้หมั่นฝึกฝน', slides: thaiLetterSlides },
  { id: 'master', type: 'slideshow', title: 'การวิเคราะห์ตัวอักษรไทยและลักษณะตัวอักษรไทย', description: 'ศึกษาการวิเคราะห์และลักษณะของตัวอักษรไทยผ่านสไลด์', difficulty: 'ขั้นสูง', color: 'green', icon: 'book', xp: 300, badge: 'ผู้รอบรู้', slides: thaiAnalysisSlides },
]
