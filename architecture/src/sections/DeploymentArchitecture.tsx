import { motion, useInView } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import Section from '../components/Section'
import FlowDiagram from '../components/FlowDiagram'
import { deployFlow, deploySteps } from '../lib/data'

export default function DeploymentArchitecture() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const [active, setActive] = useState(-1)
  const [done, setDone] = useState(false)
  const running = useRef(false)

  const run = useCallback(() => {
    if (running.current) return
    running.current = true
    setDone(false)
    setActive(-1)
    let i = 0
    const next = () => {
      if (i >= deploySteps.length) {
        setActive(-1)
        setDone(true)
        running.current = false
        return
      }
      setActive(i)
      const ms = deploySteps[i].ms
      i++
      window.setTimeout(next, ms)
    }
    next()
  }, [])

  useEffect(() => {
    if (inView) run()
  }, [inView, run])

  const pct = done ? 100 : active >= 0 ? ((active + 1) / deploySteps.length) * 100 : 0

  return (
    <Section
      id="deployment"
      index="05"
      eyebrow="Deployment Architecture"
      title={<>Push to master, <span style={{ color: 'var(--accent)' }}>live in ~4 minutes.</span></>}
      kicker="Fully automated CI/CD with a health-gate and automatic rollback. No manual steps. Watch a release move through the pipeline."
    >
      <div ref={ref} className="glass rounded-2xl p-5 md:p-8">
        <div className="mb-5 flex items-center justify-between">
          <span className="mono text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--mute)' }}>
            GitHub Actions → ACR → AKS
          </span>
          <button onClick={run} className="mono rounded-lg border px-4 py-2 text-[12px] font-medium transition-colors hover:border-[var(--accent)]" style={{ borderColor: 'var(--line-2)', color: 'var(--text)' }}>
            ▶ Run deployment
          </button>
        </div>

        {/* progress bar */}
        <div className="relative mb-2 h-[3px] w-full overflow-hidden rounded-full" style={{ background: 'var(--line-2)' }}>
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', boxShadow: '0 0 10px var(--accent-glow)' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        <FlowDiagram diagram={deployFlow} activeId={!done && active >= 0 ? deploySteps[active].id : undefined} />

        {/* current step detail */}
        <div className="mt-2 min-h-[58px] rounded-xl border border-[var(--line)] bg-[var(--bg-2)] p-4">
          <div className="mono text-[11px] uppercase tracking-wider" style={{ color: done ? 'var(--ok)' : 'var(--accent)' }}>
            {done ? '✓ Deployed' : active >= 0 ? deploySteps[active].label : 'Idle'}
          </div>
          <p className="mt-1 text-sm" style={{ color: 'var(--dim)' }}>
            {done
              ? 'Health probe passed — the new revision is serving traffic. A failed probe would auto-rollback to the previous image.'
              : active >= 0
                ? deploySteps[active].detail
                : 'Press Run to step a release through the pipeline.'}
          </p>
        </div>
      </div>
    </Section>
  )
}
