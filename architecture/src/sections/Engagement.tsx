import { motion } from 'framer-motion'
import Section from '../components/Section'

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' },
  transition: { duration: 0.5 },
} as const

// ── Section 1 · How I Work ───────────────────────────────────
function HowIWork() {
  const points = [
    ['End-to-end', 'One engineer owns everything — architecture through deployment. No hand-offs, no agency layers.'],
    ['Fixed-price', 'Three months, milestone-based. You know the cost and the timeline before we start.'],
    ['Weekly reports', 'A written progress report every Friday — what shipped, what is next, what is at risk.'],
  ]
  return (
    <Section id="work" index="09" eyebrow="Engagement Model" title={<>How I <span style={{ color: 'var(--accent)' }}>work.</span></>}>
      <p className="max-w-3xl text-lg leading-relaxed" style={{ color: 'var(--text)' }}>
        I deliver production AI platforms end-to-end in 3 months. Fixed-price. Milestone-based.
        Weekly written reports throughout. One engineer who owns everything — architecture through deployment.
      </p>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {points.map(([t, b], i) => (
          <motion.div key={t} {...reveal} transition={{ duration: 0.5, delay: i * 0.06 }} className="glass rounded-2xl p-5">
            <div className="display text-[1.05rem] font-semibold" style={{ color: 'var(--text)' }}>{t}</div>
            <p className="mt-2 text-[13.5px] leading-snug" style={{ color: 'var(--dim)' }}>{b}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

// ── Section 2 · Pricing ──────────────────────────────────────
function Pricing() {
  const rows = [
    ['UK / EU Startup', '£50,000', 'up to £61,000'],
    ['US Startup', '$60,000', 'up to $73,000'],
    ['India Enterprise', '₹35,00,000', 'up to ₹42,50,000'],
  ]
  return (
    <Section id="pricing" index="10" eyebrow="Engagement Pricing" title={<>Fixed-price <span style={{ color: 'var(--accent)' }}>platform build.</span></>} kicker="One price per market for a complete, production-deployed AI platform. Bonuses are earned on top, only for on-time delivery.">
      <div className="glass overflow-hidden rounded-2xl">
        <div className="mono grid grid-cols-3 gap-px border-b border-[var(--line)] px-6 py-3 text-[10.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--mute)' }}>
          <span>Market</span><span>Base fee</span><span className="text-right">With on-time bonuses</span>
        </div>
        {rows.map(([m, base, tot], i) => (
          <motion.div key={m} {...reveal} transition={{ duration: 0.45, delay: i * 0.05 }} className="grid grid-cols-3 items-center gap-2 px-6 py-5" style={{ borderTop: i ? '1px solid var(--line)' : 'none' }}>
            <span className="text-sm" style={{ color: 'var(--dim)' }}>{m}</span>
            <span className="display text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{base}</span>
            <span className="display text-right text-lg font-semibold" style={{ color: 'var(--accent)' }}>{tot}</span>
          </motion.div>
        ))}
      </div>
      <p className="mono mt-4 text-[12px]" style={{ color: 'var(--mute)' }}>
        Day rate (advisory / architecture review): <span style={{ color: 'var(--text)' }}>£600–750/day</span> · outside IR35
      </p>
    </Section>
  )
}

// ── Section 3 · Payment schedule ─────────────────────────────
function PaymentSchedule() {
  const ms = [
    ['Month 1', 'Architecture & Demo', 'Full system design signed off. Working demo on staging. Client sees exactly what they are getting before production code is written.', '35% on contract signing', '£17,500 at £50k base'],
    ['Month 2', 'MVP on Staging', 'Complete product built and running on staging. CI/CD live. Security pipeline running. Frontend complete. Client UAT sign-off.', '30% on Month 1 demo acceptance', '£15,000'],
    ['Month 3', 'Production + Support', "Live on client's cloud. Monitoring live. Runbook written. Team walkthrough. 4 weeks post-launch support included.", '25% on MVP sign-off  +  10% on go-live', '£12,500 + £5,000'],
  ]
  return (
    <Section id="schedule" index="11" eyebrow="Payment Schedule" title={<>Three months. Three milestones. <span style={{ color: 'var(--accent)' }}>Tied to delivery.</span></>}>
      <div className="grid gap-3 md:grid-cols-3">
        {ms.map(([mo, t, d, pay, amt], i) => (
          <motion.div key={mo} {...reveal} transition={{ duration: 0.5, delay: i * 0.07 }} className="glass flex flex-col rounded-2xl p-6">
            <span className="mono text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>{mo}</span>
            <h3 className="display mt-1.5 text-lg font-semibold tracking-tight" style={{ color: 'var(--text)' }}>{t}</h3>
            <p className="mt-3 flex-1 text-[13.5px] leading-snug" style={{ color: 'var(--dim)' }}>{d}</p>
            <div className="mt-5 border-t border-[var(--line)] pt-4">
              <div className="mono text-[11px]" style={{ color: 'var(--accent)' }}>{pay}</div>
              <div className="display mt-1 text-base font-semibold" style={{ color: 'var(--text)' }}>{amt}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

// ── Section 4 · Milestone bonuses ────────────────────────────
function Bonuses() {
  const rows = [
    ['Month 1 demo delivered on time', '£2,000'],
    ['Month 2 MVP staging sign-off on time', '£3,000'],
    ['Month 3 production live on time', '£4,000'],
    ['Zero P0 / P1 bugs in first 14 days post-launch', '£2,000'],
  ]
  return (
    <Section id="bonuses" index="12" eyebrow="Milestone Bonuses" title={<>Skin in the <span style={{ color: 'var(--accent)' }}>game.</span></>} kicker="If I deliver on time, you pay the bonus. If I am late, you don't. This is how I hold myself accountable.">
      <div className="glass overflow-hidden rounded-2xl" style={{ borderColor: 'rgba(62,224,138,0.3)' }}>
        {rows.map(([t, b], i) => (
          <div key={t} className="flex items-center justify-between gap-4 px-6 py-4" style={{ borderTop: i ? '1px solid var(--line)' : 'none' }}>
            <span className="text-sm" style={{ color: 'var(--dim)' }}>{t}</span>
            <span className="display font-bold tnum" style={{ color: 'var(--ok)' }}>+{b}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 border-t px-6 py-4" style={{ borderColor: 'var(--line-2)', background: 'rgba(62,224,138,0.06)' }}>
          <span className="mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--mute)' }}>Total possible bonus</span>
          <span className="display text-xl font-bold" style={{ color: 'var(--ok)' }}>£11,000</span>
        </div>
      </div>
      <p className="mt-4 text-sm" style={{ color: 'var(--dim)' }}>
        Maximum total engagement value: <span className="display font-semibold" style={{ color: 'var(--text)' }}>£61,000</span>
      </p>
    </Section>
  )
}

// ── Section 5 · What's included ──────────────────────────────
function Included() {
  const inc = [
    'All engineering across 3 milestones',
    "Deployment to client's own cloud account",
    'CI/CD pipeline setup and configuration',
    'Monitoring, health probes, alerting',
    'Architecture documentation for team handoff',
    'Operational runbook',
    'Weekly written progress reports (every Friday)',
    'Team handoff walkthrough session',
    '4 weeks post-launch support (bug fixes)',
  ]
  const not = [
    'Cloud infrastructure costs (Azure / AWS / GCP)',
    'Third-party API accounts (Twilio, Deepgram, Groq, ElevenLabs…)',
    'Features outside the Month 1 signed architecture',
    'Ongoing maintenance after the 4-week support window',
    'Team training beyond the handoff walkthrough',
  ]
  return (
    <Section id="included" index="13" eyebrow="Scope" title={<>What's <span style={{ color: 'var(--accent)' }}>included.</span></>}>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <div className="mono mb-4 text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--ok)' }}>Included in every engagement</div>
          <ul className="flex flex-col gap-2.5">
            {inc.map((c) => (
              <li key={c} className="flex items-start gap-3 text-[14px]" style={{ color: 'var(--text)' }}>
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px]" style={{ background: 'rgba(62,224,138,0.15)', color: 'var(--ok)', border: '1px solid rgba(62,224,138,0.4)' }}>✓</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="mono mb-4 text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--mute)' }}>Not included — client accounts & costs</div>
          <ul className="flex flex-col gap-2.5">
            {not.map((c) => (
              <li key={c} className="flex items-start gap-3 text-[14px]" style={{ color: 'var(--dim)' }}>
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px]" style={{ background: 'var(--bg-2)', color: 'var(--mute)', border: '1px solid var(--line-2)' }}>–</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

// ── Section 6 · Contract protections ─────────────────────────
function Protections() {
  const sev = [
    ['P0', 'System Down', 'Core platform unavailable. No calls processing.', 'Target resolution: 4 hours.', 'var(--crit)'],
    ['P1', 'Data or Security', 'Data loss, corruption, or cross-tenant data exposure.', 'Target resolution: 2 hours.', 'var(--warn)'],
    ['P2', 'Feature Degraded', 'Single feature broken for one tenant. UI issues. Non-blocking errors — normal post-launch fixes under the 4-week window.', 'Does not affect the bonus.', 'var(--accent)'],
  ]
  const clauses = [
    ['Scope Freeze', 'Features not in the Month 1 architecture sign-off are out of scope. Change requests are quoted separately at £600/day. A change request does not extend the milestone timeline unless agreed in writing.'],
    ['Acceptance Window', 'Each milestone is accepted when the client provides written approval, or fails to raise objections within 5 business days of delivery. Silence after 5 days constitutes acceptance.'],
    ['Client Dependencies', 'Delays caused by late client response (credentials, feedback, approvals) do not count against milestone timelines or bonus eligibility.'],
  ]
  return (
    <Section id="protections" index="14" eyebrow="Contract Protections" title={<>How disputes are <span style={{ color: 'var(--accent)' }}>prevented.</span></>} kicker="These clauses are in every contract. They protect both sides.">
      <div className="mono mb-4 text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--mute)' }}>Critical bug definition — only P0 and P1 count</div>
      <div className="grid gap-3 md:grid-cols-3">
        {sev.map(([p, t, d, res, col]) => (
          <div key={p} className="glass rounded-2xl p-5" style={{ borderColor: `${col}55` }}>
            <div className="flex items-center gap-2.5">
              <span className="display rounded-md px-2 py-0.5 text-sm font-bold" style={{ color: col, background: `${col}1f`, border: `1px solid ${col}55` }}>{p}</span>
              <span className="display text-[15px] font-semibold" style={{ color: 'var(--text)' }}>{t}</span>
            </div>
            <p className="mt-3 text-[13px] leading-snug" style={{ color: 'var(--dim)' }}>{d}</p>
            <p className="mono mt-3 text-[11px]" style={{ color: col }}>{res}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {clauses.map(([t, d]) => (
          <div key={t} className="glass rounded-2xl p-5">
            <div className="display text-[15px] font-semibold" style={{ color: 'var(--text)' }}>{t}</div>
            <p className="mt-2 text-[13px] leading-snug" style={{ color: 'var(--dim)' }}>{d}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ── Section 7 · References ───────────────────────────────────
function References() {
  const apple = [
    '6,800 outbound calls in a single week',
    '6,800 WhatsApp messages in parallel',
    '₹4.5/call all-inclusive (calls + WhatsApp + retries + reporting)',
    'Replaced 5 vendor relationships',
    'Replaced 6–7 full-time receptionists (₹90,000–1,05,000/month salary)',
    'Weekly cost: ₹30,600 vs ₹90,000+ manual equivalent',
    'Available 24 hours vs office hours only',
  ]
  return (
    <Section id="references" index="15" eyebrow="Client References" title={<>What clients <span style={{ color: 'var(--accent)' }}>say.</span></>}>
      <div className="grid gap-3 lg:grid-cols-2">
        {/* Apple Hospital */}
        <div className="glass rounded-2xl p-6 lg:row-span-2 md:p-7">
          <div className="mono mb-3 text-[10.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--accent)' }}>Apple Hospital, Burhanpur — Healthcare</div>
          <blockquote className="border-l-2 pl-4 text-[15px] italic leading-relaxed" style={{ borderColor: 'var(--accent)', color: 'var(--text)' }}>
            “Ankit delivered a single platform that consolidates voice, WhatsApp, retries and reporting — replacing what would otherwise require five separate vendor relationships and 6–7 full-time receptionists to operate. The platform operates reliably in a live healthcare environment and has materially changed how we manage patient communication and outreach. We would confidently recommend him for any engagement requiring production AI automation, healthcare communications infrastructure, voice AI systems, or end-to-end platform delivery.”
          </blockquote>
          <div className="mono mt-3 text-[11px]" style={{ color: 'var(--mute)' }}>— Apple Hospital, Burhanpur · signed reference letter available on request</div>
          <div className="mono mt-5 mb-2 text-[10.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--mute)' }}>Production numbers from this engagement</div>
          <ul className="grid gap-2">
            {apple.map((n) => (
              <li key={n} className="flex items-start gap-2.5 text-[13px]" style={{ color: 'var(--dim)' }}>
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full" style={{ background: 'var(--accent)' }} />
                {n}
              </li>
            ))}
          </ul>
        </div>

        {/* Café Ciel */}
        <div className="glass rounded-2xl p-6 md:p-7">
          <div className="mono mb-3 text-[10.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--accent)' }}>Café Ciel at The OWO, London — UK Client</div>
          <blockquote className="border-l-2 pl-4 text-[15px] italic leading-relaxed" style={{ borderColor: 'var(--accent)', color: 'var(--text)' }}>
            “Ankit independently delivered a production digital experience for Café Ciel at The OWO, London, within a highly compressed timeline. He handled implementation, revisions, deployment, and technical execution with strong ownership and responsiveness throughout. We would confidently recommend him for future technical engagements.”
          </blockquote>
          <div className="mono mt-3 text-[11px]" style={{ color: 'var(--mute)' }}>— Vedika, Founder · Café Ciel at The OWO London (Raffles) · cafeciel.co.uk</div>
        </div>

        {/* BIMTS */}
        <div className="glass rounded-2xl p-6 md:p-7">
          <div className="mono mb-3 text-[10.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--accent)' }}>BIMTS College, Burhanpur — Education</div>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--dim)' }}>
            Live production tenant on the APEX platform — student communication and outreach automation, isolated and billed independently.
          </p>
          <div className="mono mt-4 text-[11px]" style={{ color: 'var(--mute)' }}>Reference letter available on request.</div>
        </div>
      </div>
    </Section>
  )
}

// ── Section 8 · Contact ──────────────────────────────────────
function Contact() {
  const avail = ['Fixed-price platform builds (primary)', 'Architecture review & technical due diligence', 'Fractional CTO (early-stage, pre-team)', 'Day rate advisory']
  return (
    <Section id="contact" index="16" eyebrow="Contact" title={<>Start a <span style={{ color: 'var(--accent)' }}>conversation.</span></>}>
      <div className="glass rounded-2xl p-7 md:p-10">
        <p className="max-w-xl text-[15px] leading-relaxed" style={{ color: 'var(--dim)' }}>
          If this matches what you need, email me directly. No discovery calls before a brief email exchange.
          No NDAs before the first conversation. Response within 24 hours.
        </p>
        <a href="mailto:mr.ankitpanicker@gmail.com?subject=AI%20platform%20engagement" className="display mt-6 inline-block text-2xl font-bold tracking-tight md:text-3xl" style={{ color: 'var(--accent)' }}>
          mr.ankitpanicker@gmail.com
        </a>
        <div className="mt-8 grid gap-6 border-t border-[var(--line)] pt-7 md:grid-cols-2">
          <div>
            <div className="mono mb-3 text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--mute)' }}>Available for</div>
            <ul className="flex flex-col gap-2">
              {avail.map((a) => (
                <li key={a} className="flex items-center gap-2.5 text-[14px]" style={{ color: 'var(--text)' }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="mono space-y-2 text-[12.5px]" style={{ color: 'var(--dim)' }}>
            <div className="mb-3 text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--mute)' }}>Engagement</div>
            <div>Contracting: Outside IR35 · B2B direct · UK Ltd</div>
            <div>Location: India (IST / UTC+5:30)</div>
            <div>UK / EU morning hours: fully available</div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default function Engagement() {
  return (
    <>
      <HowIWork />
      <Pricing />
      <PaymentSchedule />
      <Bonuses />
      <Included />
      <Protections />
      <References />
      <Contact />
    </>
  )
}
