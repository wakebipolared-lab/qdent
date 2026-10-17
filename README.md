# Qdent

Website for the Qdent dental clinic in Bratislava. Built with React, TypeScript, Vite and Tailwind CSS.

## Local development

Requirements: Node.js 22.

```bash
npm ci
npm run dev
```

The local development server is available at `http://127.0.0.1:5173`.

## Checks

```bash
npm run typecheck
npm run i18n:check
npm run build
```

## Environment variables

Copy `.env.example` to `.env.local` and add the required values. Files matching `.env*` are excluded from Git except `.env.example`.

## Deployment

The project contains `netlify.toml` and can be connected directly to Netlify from GitHub. Netlify should run `npm run build` and publish the `dist` directory.
