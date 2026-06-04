# ApexJob.io — Job Discovery Platform

> **Project path:** `e:\Projects\apexjob.io`
> **Stack:** Vite · TypeScript · Node.js/Express (`server.ts`) · Docker Compose
> **Type:** SPA + REST API backend
> **Last major activity:** April 2026

---

## 1. Executive Technical Summary

ApexJob.io is a job discovery and listing platform deployed as a Docker-containerized Vite SPA with an Express TypeScript backend. The platform is a frontend-heavy single-page application for job seekers and employers.

**Architecture:** Standard SPA with API backend. Vite build output served by nginx or Express static middleware. TypeScript throughout.

---

## 2. System Architecture

```
Client (Vite SPA) ←→ Express server.ts ←→ External job data / Firebase
```

### 2.1 Frontend

- Vite + TypeScript SPA
- `src/` — React components
- `dist/` — production build output
- Firebase config in `.env` / `.env.example`

### 2.2 Backend

`server.ts` — Express server handling:
- Static file serving for built SPA
- API routes for job data
- Firebase integration

### 2.3 Docker

```yaml
services:
  # likely: frontend + api
docker-compose.yml present
Dockerfile present
```

Dockerized for consistent deployment. `.dockerignore` excludes `node_modules`.

---

## 3. Engineering Assessment

**Strengths:**
- TypeScript throughout (type safety on client + server)
- Docker containerization for consistent environments
- Firebase for auth/backend-as-a-service simplicity

**Weaknesses (inferred from structure):**
- SPA without SSR — poor SEO for job listings (major issue for job platforms)
- No server-side job indexing visible
- Standard CRUD platform — no novel infrastructure

**Operational maturity:** Low-Medium. Functional deployment but no observable CI/CD, monitoring, or performance optimization visible from structure.

---

## 4. Future Evolution Path

1. **SSR/SSG:** Next.js or Astro for SEO-critical job listing pages. Organic search is the primary acquisition channel for job boards.
2. **Full-text search:** Meilisearch or Elasticsearch for job search. Firebase queries are too limited for job search UX.
3. **Real-time notifications:** WebSocket or Firebase Realtime Database for instant job match notifications.
