# Ankit Panicker

**AI Infrastructure / Platform / Systems Engineer — Fractional CTO**
Platform Architecture · Realtime AI Infrastructure · Production Hardening

Madhya Pradesh, India (Remote) · Aligned to UK/EU core working hours
+91 98068 86886 · mr.ankitpanicker@gmail.com · linkedin.com/in/ankit-panicker

**Engagement:** Contract · Outside IR35 · UK/EU Remote
**Available for:** Fractional CTO · Platform Architecture · Realtime AI Infrastructure · Production Hardening · Technical Due Diligence

---

## Summary

I design, build, harden and hand over production-grade AI systems end-to-end — solo. Not prototypes: multi-tenant platforms serving live paying clients, real telephony traffic, and continuous uptime on constrained hardware.

Most recent delivery: **APEX**, a multi-tenant AI voice platform built solo and running in production with two paying institutional tenants. It answers inbound calls in Hindi, books appointments, and runs outbound voice + WhatsApp campaigns — and has delivered a single-week campaign of **6,800 calls and 6,800 WhatsApp messages** for a hospital client.

I take full technical ownership: spec, architecture, build, test, harden, document, hand over. No hand-holding required.

---

## Selected Proof

- **2 live production tenants** — Apple Hospital, Burhanpur and BIMTS College, Burhanpur — running on the APEX multi-tenant platform.
- **6,800 outbound calls + 6,800 WhatsApp messages** delivered in a single week as a paid campaign for Apple Hospital — fully automated, with retries and parallel WhatsApp follow-ups, at **₹4.5/call all-inclusive**.
- **Replaced 5 vendor relationships and 6–7 full-time receptionists** (₹90,000–1,05,000/month in salary alone) with one consolidated platform — work that manual staff "cannot physically complete" in the time window (client's words).
- **Entire week's outreach delivered for ₹30,600 all-in** vs ₹90,000–1,05,000/month in receptionist salary alone — plus 24-hour availability and automated reporting that manual staff could not match.
- **APEX Voice AI** — ~34,700 lines of production Python, 31 test suites including chaos, stress, soak and tenant-isolation tests; deployed on Azure Kubernetes Service with Terraform IaC and CI/CD that auto-rolls-back on a failed health gate.
- **Self-healing AI media pipeline on a 4GB GPU** — zero API cost, 2+ months continuous uptime, backpressure-controlled and chaos-tested.
- **International delivery** — independently delivered a production digital experience for **Café Ciel at The OWO, London** under a compressed timeline (reference letter available).

---

## Core Technical Focus

- **Multi-tenant platform architecture** — tenant isolation at data, auth, rate-limit and concurrency layers
- **Realtime AI inference pipelines** — voice (Twilio/Telnyx WebSocket media streams), LLM, agentic orchestration; sub-200ms first-audio on cache hit
- **Production hardening** — circuit breakers (6 named providers), bounded concurrency, graceful degradation, idempotency, graceful-drain shutdown, chaos-tested runtimes
- **Queue orchestration** — Redis async job queues, backpressure, retry/DLQ, WAL crash recovery
- **Observability** — Prometheus/Grafana, structured JSON logging, alerting rules, SLO-aware design
- **Cloud & delivery** — AKS, Docker, Terraform IaC, GitHub Actions CI/CD with health-gate rollback, Azure Key Vault + External Secrets

**Stack:** FastAPI · Python (asyncio) · Redis · Kubernetes (AKS) · Docker · Terraform · Twilio · Telnyx · Deepgram · Groq (LLaMA 3.3 70B) · Azure TTS · Firestore · React 18 / TypeScript / Vite · MySQL

**Certifications:** Generative AI Foundations · IBM Certified Solution Architect — Cloud Computing Infrastructure V1

---

## Experience

### Founder & Principal Engineer — AI Infrastructure & Machines
*Feb 2024 – Present · India (Remote)*

Independent AI systems engineer building reliable, production-grade LLM and voice automation platforms. Full ownership from architecture to hand-over.

- Designed and shipped **APEX Voice AI** — a multi-tenant AI voice telephony platform (FastAPI, Redis, AKS, Twilio/Telnyx, Deepgram, Groq, Azure TTS, Firestore) serving live institutional tenants in production.
- Engineered **tenant isolation** across every layer: namespaced Redis keys, scoped Firestore documents, per-tenant rate limits and asyncio concurrency semaphores, tenant-scoped client caches.
- Built the realtime **speech-to-speech hot path** — concurrent Twilio, Deepgram and TTS WebSocket streams per call with barge-in interrupt handling and a mulaw sidecar audio cache for sub-200ms first-audio.
- Implemented **production reliability primitives** — 6 per-provider circuit breakers, NX-based webhook idempotency, AIMD rate throttling, 90s graceful-drain shutdown.
- Stood up **CI/CD and cloud infra** — GitHub Actions → ACR → AKS rolling deploy (~4 min) with automatic rollback on health-check failure; secrets via Azure Key Vault + External Secrets Operator; whole production stack running for under ~$150/month.
- Delivered a paid outbound campaign of **6,800 calls + 6,800 WhatsApp messages in one week** for a hospital tenant — automated dialling, failed-number retries, parallel WhatsApp follow-ups and real-time campaign reporting, at **₹4.5/call all-inclusive**, replacing 5 separate vendors and 6–7 full-time receptionists.
- Built **APEX HMS**, an offline-first hospital management system (MySQL, WAL crash recovery, IndexedDB sync, RBAC, PWA) for intermittent-connectivity tier-2 deployment.
- Built a **self-healing GPU media pipeline** on a 4GB consumer GPU — Redis queue, supervisor with exponential backoff, GPU-OOM recovery, 2+ months continuous uptime at zero API cost.
- Independently delivered a **production web experience for Café Ciel at The OWO, London** under a compressed timeline (client reference letter available).

### Operations & Process Automation Associate — Naval COP
*May 2022 – Apr 2024 · India*

Led structured digitisation and workflow automation within an administrative command supporting ~5,000 personnel.

- Redesigned 5+ reporting workflows, cutting manual reconciliation effort ~30% and improving documentation accuracy across units.
- Converted manual typed records into standardised, scannable, copy-enabled digital formats for structured record-keeping and reuse.
- Standardised multilingual documentation protocols to improve cross-unit accessibility and reduce interpretation errors.
- Trained administrative teams on digital documentation standards, driving sustainable process compliance.

### Operations Project Lead — Temple Multi-Storey Construction Project
*May 2020 – Oct 2022 · India*

Sole accountability for capital, workforce and delivery on a ₹40+ lakh multi-storey construction project during lockdown.

- Directed a 500+ workforce across 3 contractors, a structural engineer and multiple vendors.
- Managed budgeting, procurement, vendor negotiation and allocation of crowdfunded capital.
- Implemented cost-control and materials-planning systems to sustain continuity under supply-chain and movement constraints.

### Founder — Sadda Adda Cafe
*Jan 2018 – Mar 2020 · India*

Launched and scaled an independent hospitality business from ₹1.5L capital to ₹3.5L first-year revenue.

- Served 100+ daily walk-ins and 50+ online orders/day within a structured ₹20K/month expense framework.
- Owned budgeting, vendor negotiation, procurement, inventory, hiring and scheduling.

### Census Data Enumerator — Government of India
*Jan 2010 – Dec 2011 · India*

Collected and verified household-level demographic data under regulated reporting standards, maintaining accuracy and audit traceability under high-volume conditions.

---

## Education

**Master of Business Administration, Finance** — Sinhgad Institute of Business Administration and Research · 2015–2017
**Bachelor of Commerce** — Devi Ahilya Vishwavidyalaya · 2012–2014

---

## References

> *"Ankit delivered a single platform that consolidates [voice, WhatsApp, retries and reporting], replacing what would otherwise require five separate vendor relationships and 6–7 full-time receptionists to operate… The platform operates reliably in a live healthcare environment and has materially changed how we manage patient communication and outreach. We would confidently recommend him for any engagement requiring production AI automation, healthcare communications infrastructure, voice AI systems, or end-to-end platform delivery."*
> — **Apple Hospital, Burhanpur** (signed letter available)

> *"Ankit independently delivered a production digital experience for Café Ciel at The OWO, London, within a highly compressed timeline. He handled implementation, revisions, deployment, and technical execution with strong ownership and responsiveness throughout… We would confidently recommend him for future technical engagements."*
> — **Vedika, Founder, Café Ciel at The OWO, London** (cafeciel.co.uk)

Full signed reference letters available on request.

---

## How I Work

Async-first, India-based, fully aligned to UK/EU core hours. I take full technical ownership — spec, build, harden, document, hand over. Outcome-based delivery, my own tooling and infrastructure, multiple concurrent clients. Engaged B2B, outside IR35.
