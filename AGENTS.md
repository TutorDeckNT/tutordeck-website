# Agent Guide

## Project

- This repository is the TutorDeck frontend: a React 18, TypeScript, Vite, and Tailwind CSS single-page application.
- Page components live in `src/pages/`; reusable UI belongs in `src/components/` and its feature folders.
- Routes are registered in `src/App.tsx`. Desktop and mobile navigation are maintained separately in `src/components/header/DesktopNavbar.tsx` and `src/components/header/MobileDock.tsx`.

## Development

- Install dependencies with `npm install` and start the local server with `npm run dev`.
- Use the existing React Router, Firebase context, shared components, and Tailwind theme tokens when extending the UI.
- When adding a route, update both desktop and mobile navigation when it should be generally discoverable.
- Use descriptive `alt` text for meaningful images. Put repository-owned static assets in `public/` and reference them from the site root.
- Keep private credentials and server-only secrets out of frontend code. Only public client configuration belongs in `VITE_` variables.
- Preserve GitHub Pages compatibility when changing routing or Vite configuration.

## Validation

- Run `npm run build` to type-check and build the production site.
- Run `npm run lint` when an ESLint configuration is available. This repository currently has no ESLint configuration, so the lint script reports that setup issue.
- There is no dedicated test script in `package.json`.
