# StudyQuest

A React + Vite student dashboard styled with Tailwind CSS and custom CSS.

## Run locally

```powershell
cd D:\rianthai.com\my-app
& "C:\Program Files\nodejs\npm.cmd" run dev
```

Open the URL printed by Vite. Run `npm.cmd run build` to produce the production files in `dist`.

## Add your topics

- Use **Edit topics** in the dashboard to set the three level titles for this browser.
- Replace the sample question objects in `src/learning.js` with your own content.
- Each level currently uses exactly three questions. `answer` is the zero-based index of the correct option (0, 1, or 2).
- Change each level's title, difficulty, badge, and XP in the same file.

## Game behavior

Students must answer all three questions correctly to finish a level and unlock the next. Incorrect attempts can be retried. Completed levels can be replayed without earning duplicate XP. The three rewards are 100, 200, and 300 XP.

Progress and topic titles are saved in this browser's local storage. This starter has no accounts or backend; progress is not shared across devices. Questions are demo learning-skills content until replaced.

Main files: `src/App.jsx` (dashboard and game), `src/learning.js` (content), `src/index.css` (Tailwind import and styling), `vite.config.js` (React and Tailwind plugins).
