# Platform Architect & Fractional CTO — Interview Reference

> Ankit Panicker | 2026 | Private — do not distribute

---

## Quick Positioning (30-second pitch)

"I build production AI infrastructure from scratch — multi-tenant voice platforms, real-time WebSocket pipelines, offline-first healthcare systems. I've shipped a SaaS AI voice agent platform that's live in production on Azure AKS, handles real customer calls via Twilio/Telnyx, and runs on Firestore + Redis. I've done everything: backend architecture, CI/CD, frontend, cloud infra, multi-tenant security, and LLM integration. I work fractionally as a technical co-founder for companies that need an architect who ships, not just designs."

---

## The Portfolio at a Glance

| Project | What It Is | Status | Key Tech |
|---|---|---|---|
| **APEX Voice AI** | Multi-tenant AI voice agent SaaS — inbound/outbound calls, WhatsApp, appointment booking | **Production** | FastAPI, AKS, Twilio, Deepgram, Groq, Redis, Firestore |
| **AIM Studio** | Marketing + dashboard frontend for APEX | **Production** | React 18, TypeScript, Vite, Firebase Hosting, TailwindCSS |
| **APEX HMS** | Offline-first hospital management system | Near-production | MySQL, WAL, PWA, IndexedDB, RBAC |
| **Asha Voice Agent** | Fully local Hindi voice AI (no cloud) | Production (local) | Whisper, llama.cpp, Kokoro TTS, RedisVL |
| **Shortz AI** | Local GPU video generation pipeline | Production (local) | XTTS v2, GPU, Redis queue |
| **VibeClone TTS** | Voice cloning TTS infrastructure | Prototype | XTTS, custom audio pipeline |
| **OpenMontage** | Agent-orchestrated video production | Active | LLM orchestration, media pipeline |

---

## The Flagship: APEX Voice AI Platform

Everything below is something you actually built and shipped.

### What it does (for non-technical interviewers)
A business subscribes, creates their tenant (clinic, call center, hospital), and immediately gets an AI voice agent that answers calls in Hindi, books appointments, runs outbound marketing campaigns, and handles WhatsApp — all without hiring anyone. Each tenant is fully isolated: their data, their calls, their rate limits.

### Architecture in one paragraph
FastAPI on Azure AKS (2 replicas, auto-scaling) behind NGINX Ingress. Firebase Auth + Firestore for user/tenant data. Redis for session state, job queue, rate limiting, and LLM cache. Twilio/Telnyx for telephony (WebSocket media streams). Deepgram for STT. Groq (LLaMA 3.3 70B) for LLM. Azure TTS for voice. WAHA for WhatsApp. GitHub Actions CI/CD → ACR → AKS rolling update. Frontend on Firebase Hosting.

### Numbers that matter
- **Sub-200ms** first audio on TTS cache hit (mulaw sidecar precomputed)
- **~600ms–1.5s** total perceived turn latency end-to-end on cache hit
- **6 circuit breakers** — one per external provider, independent failure isolation
- **10 secrets** in Azure Key Vault, synced to K8s via External Secrets Operator
- **2–5 AKS nodes** auto-scaling, Standard_B2s_v2 (cost-optimized)
- **6 named providers** with circuit breaking: Groq, Azure TTS, Deepgram, Twilio, Telnyx, WAHA

---

## Architecture Decisions — With Tradeoffs (know these cold)

### 1. Why Redis for everything?
Redis is the backbone: job queue (ZSET), session state (STRING TTL), rate limiter (counter), LLM cache (hash), idempotency (NX). Single decision keeps the stack simple — no separate message broker, no separate cache layer, no separate session store.

**Tradeoff:** Single Redis = single point of failure. Mitigated: AOF persistence (`appendfsync everysec`), `volatile-lru` eviction, 256MB cap. At current scale, Redis HA (Sentinel/Cluster) would cost more than it saves.

### 2. Why AKS over ECS/App Service?
Cost + control. AKS with B2s_v2 nodes costs ~$60/month for a HA setup. App Service for the same workload would be 3–5×. Kubernetes also gives real circuit breaker integration (liveness/readiness probes), rolling deploys, and HPA.

**Tradeoff:** Kubernetes ops overhead. Mitigated: CI/CD fully automated (push to master → deploy in 4 min), ExternalSecrets for secrets, KEDA-ready for worker scaling. One engineer can run it.

### 3. Why Firestore over Postgres?
Multi-tenant, globally distributed, serverless — zero ops. Tenant configs are JSON documents, not relational. Firebase Auth + Firestore share the same project/SDK. No connection pooling to manage.

**Tradeoff:** No complex queries. Mitigated: Redis for time-series and counters, file fallback for offline/dev. Don't use Firestore for analytics — that goes to Redis counters.

### 4. Why Groq over OpenAI?
Groq's LPU delivers ~10× lower latency for inference than OpenAI on equivalent models. For real-time voice, every 100ms matters. LLaMA 3.3 70B on Groq costs ~$0.0006/1K tokens — 10× cheaper than GPT-4o.

**Tradeoff:** Groq rate limits (500 RPM on free tier). Mitigated: AIMD concurrency throttle, per-tenant semaphores, LLM cache for repeated FAQ answers.

### 5. Why unified frontend deploy (dashboard + marketing site)?
Single Firebase Hosting deployment serves both the React dashboard (`/app/**`) and the marketing site (`/`). One deploy, one CDN, one cache header config. Marketing site (E:\WEBSITES\aim) is built separately, compiled output committed to `frontend/marketing-src/`, synced by `scripts/sync-marketing.mjs` during the dashboard build.

**Tradeoff:** Marketing content changes require a full frontend deploy. Mitigated: the sync step takes <5 seconds and is part of `npm run build`.

---

## Multi-Tenancy Implementation (deep-dive answer)

**Data isolation:** Every Firestore document is scoped to `tenants/{tid}` or `users/{email}`. Redis keys are namespaced: `rate:{tenant_id}`, `session:{call_sid}:{tenant_id}`, `llm_cache:{tenant_id}:{hash}`. No cross-tenant key access is structurally possible.

**Auth isolation:** Firebase Auth issues JWTs. Backend `get_current_user()` verifies JWT, calls `get_or_create_user(email)`, returns user record with `{email, tenant, role, active}`. Every API handler receives this user dict. Non-admin users see only their own tenant's data — enforced server-side in every endpoint.

**RBAC:** `role: "admin"` sees all tenants. `role: "client"` is scoped to `user.tenant` only. `RequireAdmin` and `require_admin` guards on all sensitive endpoints. Admin emails configurable via env var — auto-promoted at login.

**Rate limiting:** Per-tenant, per-plan daily call limits. Checked before Twilio `calls.create()`. Stored in Redis with daily TTL. Plan tiers (trial/spark/blaze) each have different limits.

**Concurrency isolation:** Per-tenant `asyncio.Semaphore` on LLM requests. One heavy tenant can't starve others. Global semaphore hard-caps total Groq concurrency to match API limits.

---

## Real-Time Pipeline (technical deep-dive)

The S2S (speech-to-speech) hot path:

```
Phone → Twilio → POST /twilio/s2s/voice (webhook)
  → FastAPI returns TwiML: <Connect><Stream url=wss://.../stream>
  → Twilio opens WebSocket to /twilio/s2s/stream
  → FastAPI opens Deepgram WebSocket (nova-2, hi-IN, 16kHz)
  → Twilio streams mulaw audio in 20ms chunks
  → FastAPI converts mulaw → PCM → Deepgram
  → Deepgram returns transcript (speech_final=true, ~250ms endpointing)
  → FastAPI sends transcript to Groq (streaming, context: last 8 turns)
  → Groq returns tokens; FastAPI splits on sentence boundaries (।?!)
  → First sentence → TTS cache lookup (SHA256 key)
  → Cache HIT: read .ulaw sidecar → stream chunks to Twilio
  → Cache MISS: Azure TTS → MP3 → decode → .ulaw sidecar → stream
  → Twilio plays audio to phone
```

**Barge-in:** User speaking while TTS plays increments `tts_turn_token`. All in-flight TTS send tasks check token at every chunk boundary — stale chunks self-abort. Twilio `clear` event sent to stop mid-sentence playback.

**Idempotency:** Twilio retries webhooks on 5xx. `_save_session(call_sid, nx=True)` uses Redis `SET NX` — concurrent retries for the same call_sid only create one session. Second caller rehydrates.

---

## Production Incidents You've Handled

### Incident 1: Onboarding loop (2026-05-26)
**Symptom:** New users stuck in onboarding forever — submitted form, got success, next login redirected to onboard again.

**Root cause:** `get_or_create_user()` creates users with `active: False`. The onboard endpoint created the tenant but never called `set_user_fields(email, {"active": True})`. So `GET /api/me` always returned `active: False` → redirect loop.

**Fix:** After `create_tenant()` succeeds, immediately call `set_user_fields(email, {"active": True, "tenant": tid, "plan": plan})`. Added recovery paths for users with existing tenants (idempotent activation). Updated admin activate API to accept `tenant` field for manual recovery.

**Lesson:** State transitions in onboarding flows must be atomic — create resource AND update user record in the same logical unit, not two separate operations.

### Incident 2: WAHA 422 crash (2026-05-26)
**Symptom:** WhatsApp panel showed "ERROR" for all tenants. UI crashed on load.

**Root cause:** WAHA Core (free tier) only supports one session named `default`. Multi-tenant code set `waha_session: tid` for each tenant. `GET /api/sessions/clinic` returned 422 → `raise_for_status()` → unhandled exception → frontend showed error.

**Fix:** Catch 422 in `get_session_status()`, return `{"status": "CORE_LIMIT"}`. Router returns clean JSON with upgrade message. No crash.

**Lesson:** External service limitations must be modeled explicitly. 422 from WAHA means "feature not available at this tier" not "server error" — the distinction matters for error handling.

### Incident 3: Tenant isolation data leak (prior session)
**Symptom:** CallHistory query key was missing tenant ID — users could see other tenants' calls.

**Root cause:** React Query cache key `['call-history']` was not scoped per tenant. All tenants shared the same cached response.

**Fix:** All query keys include tenant ID: `['call-history', tenant]`. Enforced across dashboard, analytics, live monitor.

**Lesson:** In multi-tenant SaaS, every client-side cache key is a potential data leak vector. Query keys must be tenant-scoped — same as server-side authorization.

---

## Infrastructure / DevOps Depth

### CI/CD Pipeline
GitHub Actions (`.github/workflows/cd-aks.yml`):
1. Push to `master` triggers workflow
2. Build Docker image → push to ACR (`apexacrprod.azurecr.io`) with tag `YYYYMMDD-{sha7}`
3. `kubectl set image deployment/apex-api api={image} -n apex`
4. `kubectl rollout status --timeout=120s` — fails fast if pods don't come up
5. Total: ~4 min push to production

No manual deploy steps. Infrastructure as code in `k8s/` manifests.

### Secrets Management
Azure Key Vault → External Secrets Operator → K8s `apex-secrets` (Opaque). ESO refreshes every 5 min. 10 secrets: Groq, Deepgram, Twilio, Telnyx, Azure Speech, OpenAI, WAHA, API keys. Firebase service account mounted as volume from separate secret. No secrets in environment files in repo.

### Kubernetes Workloads
- `apex-api` Deployment: 2 replicas, HPA, PDB (1 min available)
- `apex-worker` Deployment: KEDA ScaledObject (queue depth triggers)
- `redis` StatefulSet: 1 replica, PVC for AOF
- `waha-0` StatefulSet: 1 replica, PVC for WhatsApp session state
- `cert-manager` + Let's Encrypt: automatic TLS for `app.aimmarketing.in`

### Observability
- Sentry for error tracking
- Prometheus metrics at `/metrics` (in-process counters)
- Structured `log_event()` throughout — consistent JSON fields: `event`, `tenant`, `call_sid`, `duration_ms`, `error`
- SSE log stream endpoint for real-time log tailing in the dashboard
- `kubectl logs -l app=apex-api --tail=100` for pod-level debugging

---

## Frontend Architecture

### Stack
React 18 + TypeScript + Vite + TailwindCSS + React Query + Zustand + Framer Motion + Recharts. Firebase Auth for login. All pages lazy-loaded via `React.lazy` + `Suspense`.

### Key patterns
- `useAuthStore` (Zustand): `{user, role, tenant, active, apiKeyMode, backendUrl}` — single source of truth
- All React Query keys include `tenant` to prevent cross-tenant cache leaks
- `AppLayout` polls `/healthz` every 30s — shows red banner if backend unreachable
- Auth flow: Firebase token → `GET /api/me` → `{role, tenant, active}` → route to dashboard or `/onboard`
- Lazy loading + Vite `manualChunks`: main bundle reduced from 2007KB to 253KB

### Canvas particle animation (ParticleFaviconIntro)
Built a custom particle system for the intro screen:
- Canvas 2D with SoA (Structure of Arrays) typed arrays for ~10K particles
- Spring-damper physics: `v += (target - pos) * spring; v *= damping; pos += v`
- Critical damping condition: `spring ≤ 2*(1-damping)/(1+damping)` — no oscillation
- Mobile: `source-over` composite (fast), render every 2nd frame, tight cyclone spawn
- Desktop: `lighter` additive blend (glow effect), 4 depth layers, shadow blur
- Mouse/touch repulsion field (100px radius)
- Spawns from cyclone at bottom 88% of screen, spirals up to form logo

---

## Common Interview Questions — Talk Tracks

### "Tell me about the most complex system you've built."
APEX Voice AI — real-time speech-to-speech pipeline with sub-1.5s latency. The complexity is in the concurrency: multiple WebSocket streams (Twilio, Deepgram, TTS) active simultaneously per call, multiplied across 10-20 concurrent calls. I used asyncio throughout with careful queue management. The barge-in interrupt mechanism required generation tokens checked at every TTS chunk boundary to prevent stale audio. The mulaw sidecar cache was the key latency win — precomputed at startup, eliminates MP3 decode on hot paths.

### "How do you think about multi-tenancy?"
At every layer: data (namespaced keys in Redis, scoped Firestore documents), auth (JWT → user record → tenant scope on every endpoint), rate limits (per-tenant semaphores and daily counters), compute (per-tenant concurrency limits so one heavy user can't starve others), and client-side cache (React Query keys include tenant_id — a cache without tenant scope is a data leak). I've debugged actual cross-tenant data leaks from missing tenant scope in client-side query keys.

### "How do you handle external API failures?"
Six named circuit breakers — one per provider (Groq, Azure TTS, Deepgram, Twilio, Telnyx, WAHA). State machine: CLOSED → OPEN (N failures) → HALF_OPEN (probe) → CLOSED/OPEN. TTS has tighter thresholds (3 failures) because failures are silent to the caller. Breakers are independent — Groq outage doesn't affect Twilio dialing. After a breaker opens, callers immediately get a graceful error instead of a 30s timeout. That's the real value — not recovery, but fast failure.

### "What's your approach to CI/CD?"
Push to master = automatic deploy. No manual steps. Build, push to ACR, rolling update AKS, verify rollout status. If rollout fails, the workflow fails and the previous version stays live. Rollback is one command: `kubectl rollout undo`. For frontend: `npm run build && firebase deploy`. Same pattern. The goal is that anyone on the team can deploy without understanding the infra.

### "How do you keep infrastructure costs low?"
Three principles: right-size first, pay-as-you-go second, eliminate idle third. AKS on B2s_v2 nodes (2 vCPU, 8GB, ~$30/month each) vs Standard_D series ($80+). HPA scales down to 2 nodes off-peak. Firebase Hosting is free for the traffic levels. Groq is 10× cheaper than OpenAI for inference. Redis is the only stateful service — no Postgres, no Kafka, no separate session service. The whole stack runs for <$150/month in production.

### "Describe a technical decision you'd make differently."
The `docker.sock` supervisor pattern — mounting the Docker socket for the supervisor container is a privilege escalation risk. Any process that can talk to docker.sock has root on the host. In hindsight, I'd use Kubernetes liveness/readiness probes directly instead of a custom supervisor, or systemd with `Restart=always` on bare metal. The supervisor pattern made sense in a Docker Compose world but doesn't translate to Kubernetes.

### "How do you approach security in multi-tenant SaaS?"
Defense in depth at four levels: (1) Auth — every request verifies Firebase JWT, no unauthenticated paths except `/healthz` and `/login`. (2) Authorization — server-side tenant scope on every endpoint, not just UI-level. (3) Secrets — Azure Key Vault, never in code or env files. (4) Network — API port bound to 127.0.0.1 only, nginx is the only external entry point. The thing I watch most carefully is the authorization layer — I've seen auth bugs where a JWT was valid but the user could access another tenant's data because the endpoint didn't check `user.tenant`.

### "What's the difference between a principal engineer and a fractional CTO?"
As an engineer, I optimize for code quality and technical correctness. As a fractional CTO, I optimize for business outcomes. That means: which technical debt is costing us money now vs. which is theoretical risk. Whether to build vs. buy vs. integrate. How to sequence the roadmap to unlock the next funding stage. How to hire the first two engineers so they're complementary, not overlapping. The engineering decisions I make as fCTO are explicitly informed by runway, competitive window, and what the business needs to prove in the next 90 days.

---

## Tech Stack Vocabulary — Know These Cold

| Technology | Role in Your Stack | What to Say |
|---|---|---|
| **FastAPI** | Backend web framework | "Async-first Python, automatic OpenAPI, dependency injection for auth — I use `Depends(get_current_user)` to inject the authenticated user record into every handler" |
| **Redis** | Queue + session + cache + rate limiter | "Five different uses: ZSET priority queue, STRING session state with TTL, NX idempotency, per-tenant rate counters, LLM response cache" |
| **Firestore** | Primary datastore | "Serverless, globally distributed, scales to zero — no ops. Works well for document-model data like tenant configs and user records" |
| **AKS** | Container orchestration | "Azure Kubernetes Service — 2 API replicas + worker + Redis + WAHA, HPA auto-scaling, cert-manager for TLS, ExternalSecrets for vault integration" |
| **Twilio** | Telephony | "WebSocket media streams for real-time audio — POST webhook returns TwiML, Twilio opens WS back to our server, we stream raw PCM" |
| **Deepgram** | Speech-to-text | "WebSocket, nova-2 model, Hindi language model, 16kHz, endpointing at 250ms — gives us speech_final events" |
| **Groq** | LLM inference | "LPU-based inference, 10× lower latency than OpenAI, LLaMA 3.3 70B — the speed matters for real-time voice" |
| **React Query** | Client-side async state | "Every query key includes tenant_id to prevent cross-tenant cache leaks — learned this the hard way" |
| **GitHub Actions** | CI/CD | "Push to master → build Docker → push ACR → kubectl rolling update → rollout status check. 4 minutes end to end" |
| **External Secrets Operator** | K8s secret sync | "Pulls 10 secrets from Azure Key Vault into a single K8s `apex-secrets` Opaque secret every 5 minutes" |

---

## Platform Architect Principles (your philosophy)

**1. Failure modes before features.** Circuit breakers, idempotency, and graceful shutdown are implemented before the feature works fully. A production system that fails cleanly is worth more than one that works perfectly under ideal conditions.

**2. Stateless app, stateful infrastructure.** API pods are ephemeral — all state in Redis or Firestore. This makes rolling deploys trivial and horizontal scaling a config change, not a refactor.

**3. One operational decision eliminates ten engineering decisions.** Choosing Redis as the universal backbone means no debate about whether to use SQS, ElastiCache, or a database for the queue. The decision space collapses.

**4. Tenant isolation is a first-class constraint.** Every data access pattern, every cache key, every query gets reviewed for cross-tenant leakage. It's not a security review — it's the default design question: "can this touch another tenant's data?"

**5. Boring infrastructure, interesting product.** The infra stack (FastAPI + Redis + Firestore + AKS) is deliberately conventional. The interesting work is in the real-time voice pipeline, the LLM orchestration, and the product logic. Don't innovate in the infrastructure unless you have to.

**6. Cost is an architecture constraint.** $150/month for a production-grade multi-tenant SaaS is achievable with the right decisions. B2s_v2 nodes, Groq over OpenAI, Firebase Hosting over CloudFront, shared Redis over managed ElastiCache. These aren't compromises — they're the right decisions for the business stage.

---

## Fractional CTO Value Proposition

**What you bring that a senior engineer doesn't:**
- Full-stack from product requirements → architecture → implementation → deployment → monitoring
- Built multi-tenant SaaS from zero to production — seen every failure mode
- Can scope the MVP that proves the business thesis in 90 days, not the system that handles 10M users
- Cloud-cost fluent — can reduce a $2,000/month infra bill to $300 without degrading reliability
- LLM integration experience that goes beyond "wrap the OpenAI API" — real-time streaming, concurrency control, caching, circuit breaking
- Production incident debugging — have diagnosed and fixed data leaks, infinite loops, auth bypasses, 422 cascades under production load

**Engagement types that fit well:**
- Series A–B startups building their first cloud platform
- AI product companies that need real infrastructure under their demo
- Healthcare / regulated verticals where offline-first and data isolation matter
- Indian SMB SaaS where Hindi-first and cost constraints are real requirements

---

## Questions to Ask Interviewers

1. "What's the biggest infrastructure risk keeping the CTO up at night right now?"
2. "How many tenants are you at, and what breaks first at 10×?"
3. "What does the current deployment process look like — how long from merge to prod?"
4. "Is the backend stateless, or is there session state that makes horizontal scaling hard?"
5. "What's the cost structure — are you on pay-as-you-go or overprovisioned reserved capacity?"
6. "What's the on-call situation — who gets paged when something breaks at 2am?"

---

*Last updated: 2026-05-26*
