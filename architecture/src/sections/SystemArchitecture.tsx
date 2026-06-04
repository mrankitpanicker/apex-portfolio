import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Section from '../components/Section'
import FlowDiagram from '../components/FlowDiagram'
import { layers, systemFlow } from '../lib/data'
import { accentVar } from '../lib/ui'

export default function SystemArchitecture() {
  const [sel, setSel] = useState('ai')
  const layer = layers.find((l) => l.id === sel)!
  const col = accentVar[layer.accent]

  return (
    <Section
      id="system"
      index="02"
      eyebrow="System Architecture"
      title={<>Six layers, <span style={{ color: 'var(--accent)' }}>cleanly separated.</span></>}
      kicker="The request travels edge → application → services → AI → data, observed throughout. Hover to trace it; click any layer to open its services."
    >
      <div className="glass rounded-2xl p-5 md:p-8">
        <FlowDiagram diagram={systemFlow} selectable selectedId={sel} onSelect={setSel} />
      </div>

      {/* selected layer detail */}
      <div className="mt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl p-6 md:p-8"
            style={{ borderColor: `${col}55` }}
          >
            <div className="mb-5 flex items-baseline gap-3">
              <span className="mono text-[11px] uppercase tracking-[0.18em]" style={{ color: col }}>
                Layer — {layer.name}
              </span>
              <span className="text-sm" style={{ color: 'var(--dim)' }}>{layer.role}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {layer.services.map((s) => (
                <div key={s.name} className="rounded-xl border border-[var(--line)] bg-[var(--bg-2)] p-4 transition-colors hover:border-[var(--line-2)]" style={{ boxShadow: 'inset 2px 0 0 ' + col + '55' }}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="display text-sm font-semibold" style={{ color: 'var(--text)' }}>{s.name}</span>
                    {s.tag && <span className="mono rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider" style={{ color: col, background: `${col}1a` }}>{s.tag}</span>}
                  </div>
                  <p className="mt-1.5 text-[13px] leading-snug" style={{ color: 'var(--dim)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  )
}
