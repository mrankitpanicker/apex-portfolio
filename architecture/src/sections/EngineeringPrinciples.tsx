import { motion } from 'framer-motion'
import Section from '../components/Section'
import { checklist, principles } from '../lib/data'

export default function EngineeringPrinciples() {
  return (
    <Section
      id="principles"
      index="08"
      eyebrow="Engineering Principles"
      title={<>How it's built to be <span style={{ color: 'var(--accent)' }}>trusted in production.</span></>}
      kicker="The non-negotiables behind every decision — and the readiness checklist this system actually meets."
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {principles.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6%' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
            className="glass group rounded-2xl p-5 transition-colors hover:border-[var(--line-2)]"
          >
            <div className="mono mb-3 flex items-center gap-2 text-[11px]" style={{ color: 'var(--accent)' }}>
              <span className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: 'var(--accent-dim)' }}>{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className="display text-[1.05rem] font-semibold tracking-tight" style={{ color: 'var(--text)' }}>{p.title}</h3>
            <p className="mt-2 text-[13.5px] leading-snug" style={{ color: 'var(--dim)' }}>{p.body}</p>
          </motion.div>
        ))}
      </div>

      {/* readiness checklist */}
      <div className="glass mt-4 rounded-2xl p-6 md:p-8">
        <div className="mono mb-5 text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--mute)' }}>Production readiness — verified</div>
        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          {checklist.map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-4%' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px]" style={{ background: 'rgba(62,224,138,0.15)', color: 'var(--ok)', border: '1px solid rgba(62,224,138,0.4)' }}>✓</span>
              <span className="text-[13.5px]" style={{ color: 'var(--text)' }}>{c}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
