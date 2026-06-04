import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  id: string
  index: string
  eyebrow: string
  title: ReactNode
  kicker?: ReactNode
  children: ReactNode
}

export default function Section({ id, index, eyebrow, title, kicker, children }: Props) {
  return (
    <section id={id} className="relative z-10 scroll-mt-20 border-t border-[var(--line)] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="mono mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--accent)' }}>
            <span className="h-px w-7" style={{ background: 'var(--accent)' }} />
            <span style={{ color: 'var(--mute)' }}>{index}</span>
            <span>{eyebrow}</span>
          </div>
          <h2 className="display max-w-3xl text-balance text-3xl font-semibold leading-[1.08] tracking-tight md:text-[2.7rem]">
            {title}
          </h2>
          {kicker && (
            <p className="mt-4 max-w-2xl text-[1.05rem]" style={{ color: 'var(--dim)' }}>
              {kicker}
            </p>
          )}
        </motion.div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}
