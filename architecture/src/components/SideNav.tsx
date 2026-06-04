import { useEffect, useState } from 'react'
import { sections } from '../lib/data'

export default function SideNav() {
  const [active, setActive] = useState<string>(sections[0].id)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
    >
      {sections.map((s) => {
        const on = active === s.id
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="group flex items-center justify-end gap-3"
            aria-current={on ? 'true' : undefined}
          >
            <span
              className="mono text-[10px] uppercase tracking-[0.18em] opacity-0 transition-all duration-300 group-hover:opacity-100"
              style={{ color: on ? 'var(--accent)' : 'var(--dim)' }}
            >
              {s.label}
            </span>
            <span
              className="h-2.5 w-2.5 rounded-full border transition-all duration-300"
              style={{
                borderColor: on ? 'var(--accent)' : 'var(--line-2)',
                background: on ? 'var(--accent)' : 'transparent',
                boxShadow: on ? '0 0 10px var(--accent-glow)' : 'none',
                transform: on ? 'scale(1.15)' : 'scale(1)',
              }}
            />
          </a>
        )
      })}
    </nav>
  )
}
