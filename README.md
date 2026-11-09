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

The dashboard includes three unlockable demo quiz levels, XP, badges, and progress saved in the browser. There is no account system or server database.

Use **Edit topics** to change topic names in your browser. Edit `my-app/src/learning.js` to replace the demo questions. Each level currently expects three questions; `answer` is the zero-based index of the correct option.

Main interface: `my-app/src/App.jsx`. Styles: `my-app/src/index.css`.

## Fonts

The Thai heading uses SOV PhoKhunRam by uvSOV. Font attribution and license references are included in `my-app/public/fonts`. Third-party fonts retain their own license terms.

Dependencies, build output, local environment files, preview captures, and the unused nested starter are excluded from version control.
