# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for "Društvo Naturista Hrvatske" (Croatian Naturist Society). Angular 20 SPA with a PHP backend API, served via nginx + PHP-FPM in production.

## Commands

```bash
npm start        # Dev server at http://localhost:4200 (proxies /api to localhost:54321)
npm run build    # Production build → dist/dnh-web/browser/
npm run watch    # Dev build with watch
npm test         # Karma/Jasmine unit tests
```

## Architecture

### Frontend (Angular 20, standalone components)

- `src/app/` — One directory per page (about, codex, contact, index, membership, privacy, statut) plus shared components (header, footer, navbar)
- `src/services/data.service.ts` — Central HTTP service; fetches news and announcements from `/api/main.php?type=news|announcements` and exposes them as BehaviorSubjects
- `src/services/resolvers/` — Route resolvers that pre-fetch data before component activation
- `src/models/` — `INewsItem` and `IAnnouncement` interfaces (identical shape: date, blurb, imageURL, optional link)
- `src/app/app.routes.ts` — All route definitions with resolver wiring

### Backend (PHP 8.4)

- `api/main.php` — Returns JSON for `?type=news` or `?type=announcements`
- `api/upload.php` — File upload endpoint with MIME type validation

### Infrastructure

- `Dockerfile` — Multi-stage: Node 22 builds Angular, then nginx 1.29 + PHP-FPM 8.4 serves it on port 50004
- `nginx.conf` — SPA fallback to `index.html`, PHP-FPM proxy via unix socket, static asset serving
- `proxy.conf.json` — Dev proxy: `/api/*` → `http://localhost:54321`
- Volumes mounted for `/usr/share/nginx/html/images` and `/usr/share/nginx/html/documents`

### Data flow

Route activated → resolver calls `DataService` → `HttpClient` hits `/api/main.php` → PHP returns JSON → BehaviorSubject emits → component template renders.

## Key details

- All UI text is in Croatian
- Bootstrap 5 for styling, SCSS throughout
- Strict TypeScript mode enabled
- Angular budget limits: 500 KB initial bundle (hard stop at 1 MB), 2 KB per component style
