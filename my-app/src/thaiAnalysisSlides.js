export const thaiAnalysisSlides = Array.from({ length: 14 }, (_, index) => ({
  title: 'การวิเคราะห์ตัวอักษรไทยและลักษณะตัวอักษรไทย',
  image: `${import.meta.env?.BASE_URL ?? '/'}lessons/thai-analysis/slide-${String(index + 1).padStart(2, '0')}.jpg`,
}))
