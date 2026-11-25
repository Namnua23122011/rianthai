# เรียนไทย

A React + Vite student dashboard styled with Tailwind CSS and custom CSS.

## Run locally

```powershell
cd D:\rianthai.com\my-app
& "C:\Program Files\nodejs\npm.cmd" run dev
```

Open the URL printed by Vite. Run `npm.cmd run build` to produce the production files in `dist`.

## Add your topics

- Use **แก้ไขชื่อบทเรียน** in the dashboard to customize the three lesson titles in this browser.
- Slideshow metadata is in `src/learning.js` and the three slide modules; rendered pages are under `public/lessons`.
- Change each level's title, difficulty, badge, and XP in the same file.

## Game behavior

Students view each chapter's slides and confirm completion to unlock the next chapter. Completed lessons can be replayed without earning duplicate points. The three rewards are 100, 200, and 300 points.

Progress and custom lesson titles are stored only in this browser using localStorage. No login, account, database, or environment variables are required. Clearing browser data removes saved progress; progress does not sync between devices. Existing browser-local progress is retained. Previous cloud account records are not migrated.

## Verification

Run npm run build and node --test src/learningProgress.test.js src/matchingCards.test.js.

Main files: `src/App.jsx` (dashboard and game), `src/learning.js` (content), `src/index.css` (Tailwind import and styling), `vite.config.js` (React and Tailwind plugins).
