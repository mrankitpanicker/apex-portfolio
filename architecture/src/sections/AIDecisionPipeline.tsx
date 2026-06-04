import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Section from '../components/Section'
import FlowDiagram from '../components/FlowDiagram'
import { pipeline, pipelineFlow } from '../lib/data'

export default function AIDecisionPipeline() {
  const [sel, setSel] = useState(3) // LLM, the interesting one
  const stage = pipeline[sel]

  return (
    <Section
      id="pipeline"
      index="03"
      eyebrow="AI Decision Pipeline"
      title={<>From utterance to action, <span style={{ color: 'var(--accent)' }}>deterministically.</span></>}
      kicker="Every turn runs the same seven stages — no black box, each step explicit, validated and idempotent. Hover to trace the flow, click a stage to open it."
    >
      <div className="glass rounded-2xl p-5 md:p-8">
        <FlowDiagram
          diagram={pipelineFlow}
          selectable
          selectedId={stage.id}
          onSelect={(id) => setSel(pipeline.findIndex((p) => p.id === id))}
        />
      </div>

      {/* detail panel */}
      <div className="mt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="glass grid gap-6 rounded-2xl p-6 md:grid-cols-[1.4fr_1fr] md:p-8"
          >
            <div>
              <div className="mono mb-3 text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
                Stage {String(sel + 1).padStart(2, '0')} / 07 — {stage.label}
              </div>
              <p className="text-[1.05rem] leading-relaxed" style={{ color: 'var(--text)' }}>{stage.detail}</p>
            </div>
            <ul className="flex flex-col gap-2.5 border-t border-[var(--line)] pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              {stage.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--dim)' }}>
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 6px var(--accent-glow)' }} />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  )
}
