// ─────────────────────────────────────────────────────────────
// APEX architecture — single source of truth.
// All technical detail preserved from the production system.
// ─────────────────────────────────────────────────────────────

export interface DNode {
  id: string
  label: string
  sub?: string
  x: number
  y: number
  w?: number
  h?: number
  desc?: string
  accent?: 'cyan' | 'blue' | 'violet' | 'ok' | 'crit'
}
export interface DEdge {
  from: string
  to: string
  flow?: boolean
  dashed?: boolean
  label?: string
}
export interface Diagram {
  w: number
  h: number
  nodes: DNode[]
  edges: DEdge[]
}

// ── 1 · Executive business flow ──────────────────────────────
const N = 156
const NW = 150
const NH = 82
const Y = 150
const row = (labels: [string, string, string][]): DNode[] =>
  labels.map((l, i) => ({
    id: l[0],
    label: l[1],
    sub: l[2],
    x: 24 + i * N,
    y: Y,
    w: NW,
    h: NH,
  }))

export const execFlow: Diagram = {
  w: 24 * 2 + 6 * N - (N - NW),
  h: 300,
  nodes: row([
    ['cust', 'Customer', 'inbound / outbound'],
    ['chan', 'Channels', 'Voice · WhatsApp'],
    ['ai', 'AI Layer', 'STT · LLM · TTS'],
    ['logic', 'Business Logic', 'rules · tenancy'],
    ['data', 'Data Layer', 'state · records'],
    ['act', 'Actions', 'book · notify · log'],
  ]).map((n, i) => ({
    ...n,
    accent: (['cyan', 'cyan', 'blue', 'violet', 'cyan', 'ok'] as const)[i],
    desc: [
      'A patient or lead reaches the tenant by phone or WhatsApp — inbound calls or outbound campaigns.',
      'Twilio / Telnyx telephony and WAHA WhatsApp terminate at the edge as real-time media + message streams.',
      'Deepgram transcribes, Groq reasons, Azure synthesises — the speech-to-speech hot path, sub-second per turn.',
      'Per-tenant isolation, RBAC, rate limits and plan policy decide what is allowed before anything executes.',
      'Redis holds session, queue, cache and idempotency; Firestore / SQL hold durable tenant records.',
      'The system books the appointment, fires the WhatsApp follow-up, and writes an auditable outcome.',
    ][i],
  })),
  edges: [
    { from: 'cust', to: 'chan', flow: true },
    { from: 'chan', to: 'ai', flow: true },
    { from: 'ai', to: 'logic', flow: true },
    { from: 'logic', to: 'data', flow: true },
    { from: 'data', to: 'act', flow: true },
  ],
}

// ── 2 · System architecture (layered, expandable) ────────────
export interface Service {
  name: string
  desc: string
  tag?: string
}
export interface Layer {
  id: string
  name: string
  role: string
  accent: 'cyan' | 'blue' | 'violet' | 'ok'
  services: Service[]
}

export const layers: Layer[] = [
  {
    id: 'edge',
    name: 'Edge',
    role: 'Ingress, transport termination & TLS',
    accent: 'cyan',
    services: [
      { name: 'Twilio / Telnyx WS', desc: 'Bidirectional WebSocket media streams; 20ms mulaw chunks in/out.', tag: 'telephony' },
      { name: 'WAHA', desc: 'WhatsApp HTTP API gateway for inbound/outbound messaging per tenant.', tag: 'whatsapp' },
      { name: 'NGINX Ingress', desc: 'Single external entry point on AKS; routes to API, terminates connections.', tag: 'k8s' },
      { name: 'cert-manager + TLS', desc: "Let's Encrypt automatic certificates for app.aimmarketing.in.", tag: 'tls' },
    ],
  },
  {
    id: 'app',
    name: 'Application',
    role: 'Request handling, auth & tenancy',
    accent: 'blue',
    services: [
      { name: 'FastAPI (ASGI)', desc: 'Async-first Python app; WebSocket + REST handlers on the hot path.', tag: 'api' },
      { name: 'Firebase Auth (JWT)', desc: 'Every request verifies a JWT → user record injected via Depends().', tag: 'authn' },
      { name: 'RBAC', desc: 'admin / client roles; server-side tenant scope on every endpoint.', tag: 'authz' },
      { name: 'Tenant Router', desc: 'To-number → tenant config; namespaced Redis keys, per-tenant limits.', tag: 'multi-tenant' },
    ],
  },
  {
    id: 'svc',
    name: 'Services',
    role: 'Domain orchestration & business logic',
    accent: 'violet',
    services: [
      { name: 'Orchestrator', desc: 'Coordinates STT → LLM → TTS streams + barge-in per call.', tag: 'core' },
      { name: 'Rate Limiter', desc: 'Per-tenant daily call limits by plan, atomic Redis INCR.', tag: 'governance' },
      { name: 'Appointment Store', desc: 'Books / queries appointments via tool-calls from the LLM.', tag: 'domain' },
      { name: 'WA Brain', desc: 'WhatsApp conversation + campaign logic, parallel to voice.', tag: 'domain' },
    ],
  },
  {
    id: 'ai',
    name: 'AI',
    role: 'Inference pipeline & protection',
    accent: 'cyan',
    services: [
      { name: 'Deepgram STT', desc: 'nova-2, hi-IN, 16kHz, ~250ms endpointing, speech_final events.', tag: 'stt' },
      { name: 'Groq · LLaMA 3.3 70B', desc: 'LPU inference, ~10× lower latency; streamed, sentence-split.', tag: 'llm' },
      { name: 'Azure / Edge TTS', desc: 'Neural TTS, mulaw sidecar cache for <200ms first audio.', tag: 'tts' },
      { name: '6 Circuit Breakers + AIMD', desc: 'Per-provider breakers; AIMD throttle on Groq rate limits.', tag: 'resilience' },
    ],
  },
  {
    id: 'data',
    name: 'Data',
    role: 'State, durability & cache',
    accent: 'blue',
    services: [
      { name: 'Redis 7', desc: 'Queue (ZSET) · session (TTL) · cache · rate-limit · NX idempotency.', tag: 'state' },
      { name: 'Firestore', desc: 'Tenant + user records; serverless, file fallback when degraded.', tag: 'records' },
      { name: 'WAL Queue', desc: 'Write-ahead log for crash-safe job recovery.', tag: 'durability' },
      { name: 'Audio Cache (PVC)', desc: 'Disk-backed mulaw cache, warmed at startup per tenant.', tag: 'cache' },
    ],
  },
  {
    id: 'obs',
    name: 'Observability',
    role: 'Metrics, logs, traces & alerting',
    accent: 'ok',
    services: [
      { name: 'Prometheus /metrics', desc: 'In-process counters + ETTSA p95/p99 latency histograms.', tag: 'metrics' },
      { name: 'Structured JSON logs', desc: 'log_event() with event · tenant · call_sid · duration_ms.', tag: 'logs' },
      { name: 'Trace IDs', desc: 'X-Request-ID propagated API → worker → webhook.', tag: 'tracing' },
      { name: '8 Alert Groups', desc: 'ETTSA, LLM saturation, breaker trips, provider errors, backlog, pods.', tag: 'alerting' },
    ],
  },
]

// ── 3 · AI decision pipeline ─────────────────────────────────
export interface Stage {
  id: string
  label: string
  short: string
  detail: string
  bullets: string[]
}
export const pipeline: Stage[] = [
  {
    id: 'input',
    label: 'Input',
    short: 'Caller utterance',
    detail:
      'A finalised transcript arrives from Deepgram (speech_final). The turn is tagged with a generation token so stale audio can be aborted on barge-in.',
    bullets: ['Deepgram speech_final transcript', 'Per-turn generation token', 'Barge-in interrupt handling'],
  },
  {
    id: 'ctx',
    label: 'Context Retrieval',
    short: 'Session + memory',
    detail:
      'The orchestrator assembles conversational context: the last N turns from the Redis session, the tenant configuration, and — for local agents — RedisVL vector recall of prior turns.',
    bullets: ['Last 8 turns from Redis session', 'Tenant config & persona', 'RedisVL vector recall (cosine)'],
  },
  {
    id: 'prompt',
    label: 'Prompt Assembly',
    short: 'Deterministic build',
    detail:
      'A deterministic Python builder (no LangChain) composes the system prompt, tenant persona, retrieved context and available tools — predictable tokens, predictable latency.',
    bullets: ['System prompt + tenant persona', 'Context + tool definitions', 'No LangChain — full control'],
  },
  {
    id: 'llm',
    label: 'LLM',
    short: 'Groq streaming',
    detail:
      'Groq LLaMA 3.3 70B streams tokens. Output is split on sentence boundaries (।?!.) so the first sentence dispatches to TTS before the full answer completes.',
    bullets: ['Groq LPU streaming', 'Sentence-boundary dispatch', 'Cache lookup before call (FAQ)'],
  },
  {
    id: 'valid',
    label: 'Validation',
    short: 'Guardrails',
    detail:
      'Responses are checked for format and tool-call schema validity before any side effect. Malformed tool-calls are rejected rather than executed.',
    bullets: ['Tool-call schema validation', 'Format / safety guardrails', 'Reject-not-execute on bad output'],
  },
  {
    id: 'rules',
    label: 'Business Rules',
    short: 'Policy & tenancy',
    detail:
      'Tenant policy decides if the action is permitted: per-tenant rate limits, plan tier, appointment availability and cross-tenant isolation are all enforced server-side.',
    bullets: ['Per-tenant rate / plan limits', 'Appointment availability', 'Cross-tenant isolation enforced'],
  },
  {
    id: 'act',
    label: 'Action Execution',
    short: 'Idempotent side-effects',
    detail:
      'The validated action runs: book the appointment, send the WhatsApp follow-up, stream the TTS reply, write the audit log — each guarded by Redis NX idempotency.',
    bullets: ['Book appointment / tool-call', 'WhatsApp + TTS reply', 'NX idempotency on side-effects'],
  },
]

// ── 4 · Reliability — failure domains ────────────────────────
export interface Domain {
  id: string
  title: string
  trigger: string
  accent: 'cyan' | 'blue' | 'violet' | 'crit'
  retry: string
  fallback: string
  recovery: string
  impact: string
}
export const domains: Domain[] = [
  {
    id: 'voice',
    title: 'Voice Failure',
    trigger: 'Deepgram WebSocket drop or Twilio media stall',
    accent: 'cyan',
    retry: 'Reconnect the STT socket with backoff; resume the live call mid-stream.',
    fallback: 'Hold prompt / re-ask rather than dead air; barge-in tokens abort stale audio.',
    recovery: 'Session persisted in Redis — the call rehydrates without restarting the conversation.',
    impact: 'Caller hears a natural hold, not silence. Single-call scope, no platform impact.',
  },
  {
    id: 'llm',
    title: 'LLM Failure',
    trigger: 'Groq 5xx, 429 rate-limit, or latency spike',
    accent: 'blue',
    retry: 'AIMD throttle: halve concurrency on 429, additively recover on success.',
    fallback: 'Circuit breaker opens after N failures → LLM cache / canned reply path.',
    recovery: 'HALF-OPEN probe restores traffic once Groq recovers; no manual intervention.',
    impact: 'Degraded but answered — fast graceful error beats a 30s timeout heard as silence.',
  },
  {
    id: 'queue',
    title: 'Queue / Redis Failure',
    trigger: 'Redis unavailable or restarting',
    accent: 'violet',
    retry: 'Idempotent re-enqueue (NX); workers resume from the durable queue on reconnect.',
    fallback: 'Disk JSON session fallback; WAL records intent before the job runs.',
    recovery: 'WAL replay: COMMITTED-but-not-APPLIED jobs replay, PENDING discard — no double-run.',
    impact: 'No lost jobs. New calls briefly rejected with retry-after rather than failing silently.',
  },
  {
    id: 'db',
    title: 'Database Failure',
    trigger: 'Firestore / SQL unreachable',
    accent: 'crit',
    retry: 'Bounded retries with backoff; reads served from Redis cache where possible.',
    fallback: 'File-based config fallback keeps tenant routing and core flow alive.',
    recovery: 'Writes buffer through the WAL / queue and flush when the datastore returns.',
    impact: 'Read-only continuity — callers are still served while writes catch up on recovery.',
  },
]

// ── 5 · Deployment (CI/CD) ───────────────────────────────────
export interface Step {
  id: string
  label: string
  detail: string
  ms: number
}
export const deploySteps: Step[] = [
  { id: 'push', label: 'GitHub', detail: 'Push to master triggers the workflow.', ms: 600 },
  { id: 'test', label: 'Tests', detail: 'Lint · typecheck · unit tests with a Redis service container.', ms: 1500 },
  { id: 'sec', label: 'Security', detail: 'Dependency + image scan gate before build.', ms: 1100 },
  { id: 'build', label: 'Build', detail: 'Docker image built, tagged YYYYMMDD-{sha7}.', ms: 1400 },
  { id: 'reg', label: 'Registry', detail: 'Pushed to Azure Container Registry (ACR).', ms: 900 },
  { id: 'aks', label: 'AKS Rollout', detail: 'kubectl set image → rolling update, maxUnavailable 0.', ms: 1600 },
  { id: 'prod', label: 'Production', detail: 'Health-gate probe; auto-rollback on failure. ~4 min end-to-end.', ms: 1200 },
]

// ── 6 · Observability graph ──────────────────────────────────
export const obsGraph: Diagram = {
  w: 1180,
  h: 380,
  nodes: [
    { id: 'app', label: 'APEX API', sub: 'instrumented', x: 515, y: 150, w: 150, h: 80, accent: 'blue', desc: 'The application emits all four signals from a single instrumented runtime.' },
    { id: 'metrics', label: 'Metrics', sub: 'Prometheus', x: 150, y: 30, w: 150, h: 76, accent: 'cyan', desc: 'In-process counters + ETTSA p95/p99 latency histograms at /metrics.' },
    { id: 'logs', label: 'Logs', sub: 'structured JSON', x: 150, y: 270, w: 150, h: 76, accent: 'cyan', desc: 'log_event() with event, tenant, call_sid, duration_ms — grep-able, aggregatable.' },
    { id: 'traces', label: 'Tracing', sub: 'trace IDs', x: 880, y: 30, w: 150, h: 76, accent: 'violet', desc: 'X-Request-ID propagated across API → worker → webhook for correlation.' },
    { id: 'alerts', label: 'Alerting', sub: '8 rule groups', x: 880, y: 270, w: 150, h: 76, accent: 'ok', desc: 'ETTSA, LLM saturation, breaker trips, provider errors, queue backlog, pods-down.' },
    { id: 'oncall', label: 'On-call', sub: 'paged', x: 1010, y: 150, w: 130, h: 70, accent: 'crit', desc: 'Alert rules fire to the operator; runbooks cover each failure scenario.' },
  ],
  edges: [
    { from: 'app', to: 'metrics', flow: true },
    { from: 'app', to: 'logs', flow: true },
    { from: 'app', to: 'traces', flow: true },
    { from: 'app', to: 'alerts', flow: true },
    { from: 'alerts', to: 'oncall', flow: true },
  ],
}

// ── Production metrics ───────────────────────────────────────
export interface Metric {
  to: number
  prefix?: string
  suffix?: string
  decimals?: number
  label: string
  note: string
}
export const metrics: Metric[] = [
  { to: 6800, label: 'Calls / week', note: 'Live outbound volume, single tenant', suffix: '' },
  { to: 6800, label: 'WhatsApp / week', note: 'Fired in parallel with voice' },
  { to: 40, suffix: '+', label: 'CI/CD deploys', note: 'Rolling, health-gated to AKS' },
  { to: 99.9, decimals: 1, suffix: '%', label: 'Target availability', note: 'Drain + rollback + probes' },
  { to: 200, prefix: '<', suffix: 'ms', label: 'First audio', note: 'mulaw cache hit' },
  { to: 1, prefix: '~', suffix: 's', label: 'Turn latency', note: 'STT + LLM + TTS end-to-end' },
  { to: 34700, label: 'Lines of Python', note: 'Production, single codebase' },
  { to: 31, label: 'Test suites', note: 'Chaos · stress · soak · isolation' },
]

// ── Engineering principles ───────────────────────────────────
export const principles: { title: string; body: string }[] = [
  { title: 'Deterministic Workflows', body: 'Hand-written Python orchestration, no LangChain — predictable latency and full control of the hot path.' },
  { title: 'Failure Isolation', body: 'Six independent circuit breakers; one provider outage never cascades into another.' },
  { title: 'Idempotent Operations', body: 'Redis NX guards and UUIDv7 keys make every webhook and mutation safe to retry.' },
  { title: 'Observability First', body: 'Structured logs, Prometheus metrics and propagated trace IDs from the first commit, not bolted on.' },
  { title: 'Secure Automation', body: 'Secrets in Azure Key Vault via External Secrets; server-side tenant scope on every endpoint.' },
  { title: 'Horizontal Scalability', body: 'Stateless pods, externalised state, HPA + KEDA queue-depth scaling — capacity is a config change.' },
  { title: 'Production Readiness', body: 'CI/CD with health-gate rollback, graceful drain, runbooks and chaos-tested failure paths.' },
]

export const checklist: string[] = [
  'CI/CD pipeline',
  'Containerized',
  'Auto Scaling (HPA + KEDA)',
  'Health Checks (liveness / readiness / PDB)',
  'Retry Logic',
  'Monitoring & Alerting',
  'Audit Logging',
  'Backup & WAL Recovery',
]

// ── Linear flow builder (shared node-graph style) ────────────
type AccentT = NonNullable<DNode['accent']>
const ACC: AccentT[] = ['cyan', 'blue', 'violet', 'cyan', 'blue', 'ok', 'violet']

function linearDiagram(
  items: { id: string; label: string; sub?: string; desc?: string; accent?: AccentT }[],
): Diagram {
  const NW = 150, NH = 84, PITCH = 170, X0 = 20, NY = 108, H = 300
  const nodes: DNode[] = items.map((it, i) => ({
    id: it.id,
    label: it.label,
    sub: it.sub,
    desc: it.desc,
    accent: it.accent ?? ACC[i % ACC.length],
    x: X0 + i * PITCH,
    y: NY,
    w: NW,
    h: NH,
  }))
  const edges: DEdge[] = items.slice(1).map((it, i) => ({ from: items[i].id, to: it.id, flow: true }))
  return { w: X0 * 2 + items.length * PITCH - (PITCH - NW), h: H, nodes, edges }
}

// request flows through the six layers
export const systemFlow = linearDiagram(
  layers.map((l) => ({ id: l.id, label: l.name, desc: l.role, accent: l.accent })),
)

// the seven-stage AI decision pipeline
export const pipelineFlow = linearDiagram(
  pipeline.map((s) => ({ id: s.id, label: s.label, sub: s.short, desc: s.detail })),
)

// the CI/CD release path
export const deployFlow = linearDiagram(
  deploySteps.map((s) => ({ id: s.id, label: s.label, desc: s.detail })),
)

export const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'system', label: 'System' },
  { id: 'pipeline', label: 'AI Pipeline' },
  { id: 'reliability', label: 'Reliability' },
  { id: 'deployment', label: 'Deployment' },
  { id: 'observability', label: 'Observability' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'principles', label: 'Principles' },
  { id: 'work', label: 'How I Work' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'references', label: 'References' },
  { id: 'contact', label: 'Contact' },
] as const
