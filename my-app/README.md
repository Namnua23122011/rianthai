# เรียนไทย

A React + Vite student dashboard styled with Tailwind CSS and custom CSS.

## Run locally

```powershell
cd D:\rianthai.com\my-app
& "C:\Program Files\nodejs\npm.cmd" run dev
```

Open the URL printed by Vite. Run `npm.cmd run build` to produce the production files in `dist`.

## Add your topics

- Use **แก้ไขชื่อบทเรียน** in the dashboard to customize the three lesson titles for your account.
- Slideshow metadata is in `src/learning.js` and the three slide modules; rendered pages are under `public/lessons`.
- Change each level's title, difficulty, badge, and XP in the same file.

## Game behavior

Students view each chapter's slides and confirm completion to unlock the next chapter. Completed lessons can be replayed without earning duplicate points. The three rewards are 100, 200, and 300 points.

Progress and custom lesson titles are now stored per account in Supabase. All three lessons are slideshows. Supabase Auth manages passwords, sessions, and display names.

## Supabase setup

Connected local project: `thycwxsposoblcrdugcr` (configured on 2026-11-24). The learning-record migration ran successfully and anonymous database access was verified as denied. `.env.local` contains the public connection values and is ignored by Git. Email/password authentication and email confirmation remain enabled. The local callback URL save was submitted, but its final state and end-to-end account flows still need verification.

Create a Supabase project and run `supabase/migrations/202611240001_learning_accounts.sql` once in the SQL Editor. This creates `learning_records`, validates its data, and enables row-level security so only the signed-in owner can read or write their row. Anonymous access is denied.

Copy `.env.example` to `.env.local` and fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the project's Connect dialog. Never use a service-role or secret key in the browser. Restart Vite after changing environment values; hosting needs these variables at build time.

In Authentication URL Configuration, allow the exact local URLs you use (`http://localhost:5173/` and `http://127.0.0.1:5173/`) and set the production Site URL when hosting. Enable email/password authentication with email confirmation. Configure SMTP for public signup/recovery email delivery; Supabase's default mail service is limited.

Without configuration, the login screen shows a setup notice and disables submission. The hosted database is not active until the migration and environment values are configured.

Account records start empty. Old browser-local progress is not silently copied into accounts on shared devices. Saves are serialized and failures show a retry action; logout is disabled until saved. Closing the browser forcibly can still lose unsaved changes. Concurrent devices use last-write-wins behavior. Progress is for learning, not an authoritative examination result.

## Verification

Run `npm run build` and `node --test src/accountData.test.js src/learningProgress.test.js src/matchingCards.test.js`.

After connecting Supabase, verify signup/email confirmation, login/logout, password recovery, refresh persistence, and two separate accounts. Account B must not read or update account A's record; anonymous table requests must be denied. These remote checks require a configured project and working email delivery.

References: [Supabase authentication](https://supabase.com/docs/guides/auth/passwords), [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).

Main files: `src/App.jsx` (dashboard and game), `src/learning.js` (content), `src/index.css` (Tailwind import and styling), `vite.config.js` (React and Tailwind plugins).
