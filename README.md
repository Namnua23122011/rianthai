# RianThai

A student learning dashboard built with React, Vite, and Tailwind CSS.

## Getting started

Install Node.js and npm, then run:

```sh
git clone https://github.com/Namnua23122011/rianthai.git
cd rianthai/my-app
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Commands

Run these from `my-app`:

- `npm run dev` starts the development server.
- `npm run build` builds the app into `my-app/dist`.
- `npm run preview` previews the production build.
- `npm run lint` checks the source code.

## Learning content

The dashboard includes three unlockable slideshows (15, 15, and 14 pages), points, badges, and progress saved in the browser. There is no account system or server database.

Use **แก้ไขชื่อบทเรียน** to change lesson names in your browser. Lesson one displays the supplied PDF pages in order, with previous/next and zoom controls. Viewing every slide and choosing **เรียนจบบทนี้** completes the lesson and unlocks the next quiz. Existing earned completion and other quiz scores are migrated automatically.

Edit `my-app/src/learning.js` to change lessons or quiz questions; `answer` is the zero-based index of the correct option. Slide metadata is in `my-app/src/thaiHistorySlides.js`, with the rendered images in `my-app/public/lessons/thai-history`. The original user PDF is unchanged.

Run `node --test src/learningProgress.test.js src/matchingCards.test.js` from `my-app` to check the lesson migration, slide assets, and matching game.

Main interface: `my-app/src/App.jsx`. Styles: `my-app/src/index.css`.

## Fonts

The Thai heading uses SOV PhoKhunRam by uvSOV. Font attribution and license references are included in `my-app/public/fonts`. Third-party fonts retain their own license terms.

Dependencies, build output, local environment files, preview captures, and the unused nested starter are excluded from version control.
