# เรียนไทย

React + Vite learning dashboard with Thai slideshows, exercises, and a matching game. Opens directly without login.

## Run locally

```powershell
npm install
npm run dev
```

Run `npm run build` to create production files in `dist`.

## Learning data

Slide completion and custom lesson titles are stored in this browser's local storage. Data does not sync between devices. Exercises show feedback and scores for the current attempt.

The previous Supabase database and migration remain preserved, but the app no longer connects to Supabase. Existing cloud records are not copied into local progress. No environment variables are required.

## Content

- Slideshow metadata: `src/learning.js` and the three slide modules.
- Slide images: `public/lessons`.
- Exercise questions and answer keys: `src/questionSets.js`.
- Lesson titles can be customized through **แก้ไขชื่อบทเรียน**.

Students view each chapter's slides and confirm completion to unlock the next. Repeating a lesson does not award duplicate points.

## Verification

```powershell
npm run build
node --test src/questionSets.test.js src/learningProgress.test.js src/matchingCards.test.js
```
