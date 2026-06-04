# APEX · Architecture Review

Interactive engineering showcase for **APEX** — a production multi-tenant AI voice + WhatsApp platform.
Built by Ankit Panicker / **AiM Studio**.

An architecture command-center: animated business flow, interactive layered system diagram, the AI
decision pipeline, reliability failure-domains, CI/CD deployment visualization, and the observability
layer — all from the real production system.

## Stack

React · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · SVG diagrams

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build & deploy

```bash
npm run build                          # → dist/
firebase deploy --only hosting         # project: aimsystems
```

Hosted on Firebase Hosting (`aimsystems`). Live platform: https://aimstudio.co.in/app
