import { motion } from 'framer-motion'
import Section from '../components/Section'
import Counter from '../components/Counter'
import { metrics } from '../lib/data'

export default function ProductionMetrics() {
  return (
    <Section
      id="metrics"
      index="07"
      eyebrow="Production Metrics"
      title={<>Operating numbers, <span style={{ color: 'var(--accent)' }}>not marketing.</span></>}
      kicker="Measured from the live system — real traffic, real deploys, real latency budgets."
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
            className="glass relative overflow-hidden rounded-2xl p-5"
          >
            <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full" style={{ background: 'var(--ok)', boxShadow: '0 0 8px var(--ok)' }} />
            <div className="display text-3xl font-bold tracking-tight md:text-[2.4rem]" style={{ color: 'var(--text)' }}>
              <Counter to={m.to} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals} />
            </div>
            <div className="display mt-2 text-[13px] font-medium" style={{ color: 'var(--dim)' }}>{m.label}</div>
            <div className="mono mt-1 text-[10.5px] uppercase tracking-wider" style={{ color: 'var(--mute)' }}>{m.note}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
