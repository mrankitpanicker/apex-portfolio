import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Section from '../components/Section'
import { domains } from '../lib/data'
import { accentVar } from '../lib/ui'

const rows = (d: (typeof domains)[number]) => [
  ['Retry', d.retry],
  ['Fallback', d.fallback],
  ['Recovery', d.recovery],
  ['Impact', d.impact],
] as const

export default function ReliabilityEngineering() {
  const [open, setOpen] = useState<string | null>('llm')

  return (
    <Section
      id="reliability"
      index="04"
      eyebrow="Reliability Engineering"
      title={<>Designed to <span style={{ color: 'var(--accent)' }}>fail safely.</span></>}
      kicker="Four failure domains, each isolated. The question is never “does it break?” — it's “what happens when it does?” Expand a domain to see the retry, fallback, recovery and blast radius."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {domains.map((d, i) => {
          const isOpen = open === d.id
          const col = accentVar[d.accent]
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass overflow-hidden rounded-2xl"
              style={{ borderColor: isOpen ? `${col}66` : 'var(--line)' }}
            >
              <button onClick={() => setOpen(isOpen ? null : d.id)} aria-expanded={isOpen} className="w-full px-5 py-5 text-left md:px-6">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5 flex-none">
                    <span className="absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: col, animation: 'ping 1.8s cubic-bezier(0,0,0.2,1) infinite' }} />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: col }} />
                  </span>
                  <span className="display flex-1 text-lg font-semibold tracking-tight" style={{ color: 'var(--text)' }}>{d.title}</span>
                  <span className="transition-transform duration-300" style={{ color: col, transform: isOpen ? 'rotate(90deg)' : 'none' }}>›</span>
                </div>
                <p className="mono mt-2 pl-[22px] text-[11.5px] uppercase tracking-wider" style={{ color: 'var(--mute)' }}>
                  trigger — {d.trigger}
                </p>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.3, 0.7, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                    <div className="flex flex-col gap-px border-t border-[var(--line)]" style={{ background: 'var(--line)' }}>
                      {rows(d).map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[92px_1fr] gap-3 bg-[var(--surface)] px-5 py-3 md:px-6">
                          <span className="mono pt-0.5 text-[10.5px] uppercase tracking-wider" style={{ color: k === 'Impact' ? col : 'var(--mute)' }}>{k}</span>
                          <span className="text-[13.5px] leading-snug" style={{ color: k === 'Impact' ? 'var(--text)' : 'var(--dim)' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
      <style>{`@keyframes ping{75%,100%{transform:scale(2.2);opacity:0}}`}</style>
    </Section>
  )
}
