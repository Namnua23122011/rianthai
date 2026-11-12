// Add your topic questions here. answer is the zero-based correct option index.
// Add questions to each level as needed. Topic display names can be edited in the dashboard.
export const levels = [
  { id: 'discover', title: 'Discover the basics', difficulty: 'Beginner', color: 'purple', icon: 'leaf', xp: 100, badge: 'Curious Explorer', questions: [
    { prompt: 'ในอดีตคนไทยมีวิธีอนุรักษ์ภาษาไทยอย่างไร?', options: ['ใช้ภาษาอังกฤษในการสื่อสาร', ' จารึกข้อความลงบนศิลาจารึก', ' ใช้สื่อสังคมออนไลน์'], answer: 1, explanation: 'A strong foundation helps new ideas make sense.' },
    { prompt: 'วรรณคดีไทยมีบทบาทสำคัญอย่างไรในการอนุรักษ์ภาษาไทย?', options: ['ช่วยเผยแพร่วัฒนธรรมต่างชาติ', 'ช่วยลดการใช้ภาษาไทย', 'ช่วยรักษาคำศัพท์และรูปแบบการใช้ภาษาไทย'], answer: 2, explanation: 'Putting ideas into your own words builds understanding.' },
    { prompt: 'สถาบันใดมีบทบาทสำคัญในการส่งเสริมการใช้ภาษาไทยในอดีต?', options: ['วัด', 'ห้างสรรพสินค้า', 'บริษัทเอกชน'], answer: 0, explanation: 'Mistakes help you discover what to practice next.' },
    { prompt: 'ปัจจัยใดช่วยให้ภาษาไทยยังคงสืบทอดมาจนถึงปัจจุบัน?', options:['การลดการใช้ภาษาไทย','การรับวัฒนธรรมต่างชาติเพียงอย่างเดียว','การเรียนรู้และถ่ายทอดภาษาไทยจากรุ่นสู่รุ่น'],answer: 2, explanation:''},
    { prompt: 'สื่อสังคมออนไลน์สามารถช่วยอนุรักษ์ภาษาไทยได้อย่างไร?', options: ['เผยแพร่ความรู้เกี่ยวกับภาษาไทย', 'สนับสนุนให้เลิกใช้ภาษาไทย', 'ส่งเสริมการใช้คำผิด'], answer: 0, explanation: '' },
    { prompt: 'การใช้ภาษาวิบัติมากเกินไปอาจส่งผลอย่างไร?', options: ['ทำให้เข้าใจหลักภาษาไทยมากขึ้น', 'ทำให้เกิดความสับสนในการใช้ภาษาไทยที่ถูกต้อง', 'ทำให้ภาษาไทยมีหลักไวยากรณ์ชัดเจนขึ้น'], answer: 1, explanation: '' },
    { prompt: 'คนรุ่นใหม่ควรมีส่วนร่วมในการอนุรักษ์ภาษาไทยอย่างไร?', options: ['หลีกเลี่ยงการอ่านหนังสือภาษาไทย', 'ใช้ภาษาต่างประเทศแทนภาษาไทยทั้งหมด', 'ใช้ภาษาไทยให้ถูกต้องและเหมาะสมกับกาลเทศะ'], answer: 2, explanation: '' },
    { prompt: 'วิธีใดเหมาะสมที่สุดในการนำวิธีอนุรักษ์ภาษาไทยในอดีตมาประยุกต์ใช้ในปัจจุบัน?', options: ['เลิกใช้เทคโนโลยีทั้งหมด', 'ใช้เฉพาะภาษาไทยแบบโบราณ', 'นำเทคโนโลยีมาเผยแพร่หนังสือและความรู้ภาษาไทย'], answer: 2, explanation: '' },
  ] },
  { id: 'practice', title: 'Put it into practice', difficulty: 'Intermediate', color: 'orange', icon: 'mountain', xp: 200, badge: 'Practice Pioneer', questions: [
    { prompt: 'Which approach helps you check your understanding?', options: ['Copy the answer', 'Try a problem on your own', 'Only read the heading'], answer: 1, explanation: 'Trying independently shows you what you understand.' },
    { prompt: 'You are stuck on a problem. What could help?', options: ['Break it into smaller steps', 'Ignore all the instructions', 'Guess without thinking'], answer: 0, explanation: 'Smaller steps make a difficult task more manageable.' },
    { prompt: 'Which is a useful way to review?', options: ['Avoid difficult questions', 'Only review once a year', 'Return to ideas over time'], answer: 2, explanation: 'Reviewing over time helps strengthen your memory.' },
  ] },
  { id: 'master', title: 'Master the challenge', difficulty: 'Advanced', color: 'green', icon: 'trophy', xp: 300, badge: 'Quest Champion', questions: [
    { prompt: 'How can you put knowledge to a deeper test?', options: ['Apply it in a new situation', 'Repeat a title aloud', 'Skip the explanation'], answer: 0, explanation: 'Applying an idea in a new context tests your understanding.' },
    { prompt: 'What should a clear explanation include?', options: ['Only the final answer', 'The reasoning behind the answer', 'As many long words as possible'], answer: 1, explanation: 'Reasoning shows how you reached your conclusion.' },
    { prompt: 'What is a useful next step after finishing a challenge?', options: ['Forget the experience', 'Never practice again', 'Reflect on what you learned'], answer: 2, explanation: 'Reflection helps you recognize progress and plan your next goal.' },
  ] },
]
