import { motion } from 'framer-motion'

const fade = (d: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: d, ease: [0.2, 0.7, 0.2, 1] as const },
})

export default function Hero() {
  return (
    <header className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-6 pt-28 pb-16">
      <motion.div {...fade(0)} className="mono mb-7 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--accent)' }}>
        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1" style={{ borderColor: 'var(--accent-dim)', background: 'var(--accent-dim)' }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--ok)', boxShadow: '0 0 8px var(--ok)' }} />
          Production · Live
        </span>
        <span style={{ color: 'var(--mute)' }}>Architecture Review</span>
      </motion.div>

      <motion.h1 {...fade(0.08)} className="display max-w-4xl text-balance text-5xl font-bold leading-[0.98] tracking-tight md:text-7xl">
        APEX — production AI{' '}
        <span style={{ background: 'linear-gradient(120deg, var(--accent), var(--accent-2) 60%, var(--violet))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          voice infrastructure
        </span>
        .
      </motion.h1>

      <motion.p {...fade(0.16)} className="mt-7 max-w-2xl text-lg leading-relaxed" style={{ color: 'var(--dim)' }}>
        A multi-tenant, real-time speech-to-speech platform — engineered for sub-second latency,
        graceful failure, and clean production operation. This is the system, end to end: how it
        flows, how it scales, how it fails safely, how it ships.
      </motion.p>

      <motion.div {...fade(0.24)} className="mt-9 flex flex-wrap gap-3">
        <a href="#overview" className="display rounded-lg px-6 py-3.5 text-sm font-semibold" style={{ background: 'linear-gradient(180deg, var(--accent), var(--accent-2))', color: '#04121a', boxShadow: '0 14px 34px -16px var(--accent-glow)' }}>
          Explore the architecture ↓
        </a>
        <a href="https://aimstudio.co.in/app" target="_blank" rel="noopener" className="display inline-flex items-center gap-2 rounded-lg border px-6 py-3.5 text-sm font-semibold" style={{ borderColor: 'var(--line-2)', color: 'var(--text)' }}>
          <span className="h-2 w-2 rounded-full" style={{ background: 'var(--ok)', boxShadow: '0 0 8px var(--ok)' }} />
          Live platform ↗
        </a>
      </motion.div>

      <motion.div {...fade(0.34)} className="mono mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--line)] sm:grid-cols-4" style={{ background: 'var(--line)' }}>
        {[
          ['6,800', 'calls / week'],
          ['<1s', 'turn latency'],
          ['6', 'circuit breakers'],
          ['99.9%', 'target uptime'],
        ].map(([v, k]) => (
          <div key={k} className="glass p-4">
            <div className="display text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{v}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--mute)' }}>{k}</div>
          </div>
        ))}
      </motion.div>
    </header>
  )
}
