import { useId, useMemo, useState } from 'react'
import type { Diagram, DNode } from '../lib/data'
import { accentVar } from '../lib/ui'

interface Props {
  diagram: Diagram
  selectable?: boolean
  selectedId?: string
  /** force-highlight a node programmatically (e.g. a running step) */
  activeId?: string
  onSelect?: (id: string) => void
}

const cx = (n: DNode) => n.x + (n.w ?? 150) / 2
const cy = (n: DNode) => n.y + (n.h ?? 80) / 2

export default function FlowDiagram({ diagram, selectable, selectedId, activeId, onSelect }: Props) {
  const uid = useId().replace(/:/g, '')
  const { w, h, nodes, edges } = diagram
  const [hovered, setHovered] = useState<string | null>(null)

  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes])
  const neighbors = useMemo(() => {
    const m: Record<string, Set<string>> = {}
    nodes.forEach((n) => (m[n.id] = new Set()))
    edges.forEach((e) => {
      m[e.from]?.add(e.to)
      m[e.to]?.add(e.from)
    })
    return m
  }, [nodes, edges])

  // hover wins; otherwise the programmatic active node drives the focus
  const focus = hovered ?? activeId ?? null

  const connected = (id: string) => focus === null || focus === id || neighbors[focus]?.has(id)
  const edgeActive = (from: string, to: string) => focus !== null && (focus === from || focus === to)

  const active = focus ? byId[focus] : null
  const tip = active
    ? {
        leftPct: (cx(active) / w) * 100,
        topPct: (cy(active) / h) * 100,
        below: cy(active) < h * 0.36,
      }
    : null

  return (
    <div className="relative w-full" style={{ aspectRatio: `${w} / ${h}` }}>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full overflow-visible" role="group" aria-label="Architecture flow diagram">
        {/* edges */}
        {edges.map((e) => {
          const f = byId[e.from]
          const t = byId[e.to]
          if (!f || !t) return null
          const fx = cx(f), fy = cy(f), tx = cx(t), ty = cy(t)
          const mx = (fx + tx) / 2
          const d = `M ${fx} ${fy} C ${mx} ${fy}, ${mx} ${ty}, ${tx} ${ty}`
          const pid = `${uid}-${e.from}-${e.to}`
          const act = edgeActive(e.from, e.to)
          const dim = focus !== null && !act
          return (
            <g key={pid} style={{ opacity: dim ? 0.18 : 1, transition: 'opacity .3s' }}>
              <path
                id={pid}
                d={d}
                fill="none"
                stroke={act ? 'var(--accent)' : 'var(--line-2)'}
                strokeWidth={act ? 2 : 1.4}
                strokeDasharray={e.dashed ? '5 6' : undefined}
                style={{ transition: 'stroke .3s, stroke-width .3s' }}
              />
              {e.flow && (
                <circle r={3.2} className="flow-dot">
                  <animateMotion dur="2.6s" repeatCount="indefinite" rotate="auto">
                    <mpath href={`#${pid}`} />
                  </animateMotion>
                </circle>
              )}
            </g>
          )
        })}

        {/* nodes */}
        {nodes.map((n) => {
          const nw = n.w ?? 150
          const nh = n.h ?? 80
          const on = connected(n.id)
          const isFocus = focus === n.id
          const isSel = selectedId === n.id
          const col = accentVar[n.accent ?? 'cyan']
          return (
            <g
              key={n.id}
              tabIndex={0}
              role={selectable ? 'button' : 'img'}
              aria-label={`${n.label}${n.desc ? '. ' + n.desc : ''}`}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(n.id)}
              onBlur={() => setHovered(null)}
              onClick={() => onSelect?.(n.id)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && onSelect) {
                  e.preventDefault()
                  onSelect(n.id)
                }
              }}
              style={{
                opacity: on ? 1 : 0.22,
                cursor: selectable ? 'pointer' : 'default',
                transition: 'opacity .3s',
                outline: 'none',
              }}
            >
              <rect
                x={n.x}
                y={n.y}
                width={nw}
                height={nh}
                rx={13}
                fill="rgba(14,21,33,0.92)"
                stroke={isFocus || isSel ? col : 'var(--line-2)'}
                strokeWidth={isFocus || isSel ? 1.8 : 1.2}
                style={{
                  filter: isFocus || isSel ? `drop-shadow(0 0 18px ${col}55)` : 'none',
                  transition: 'stroke .25s, filter .25s',
                }}
              />
              <rect x={n.x} y={n.y} width={3} height={nh} rx={1.5} fill={col} style={{ opacity: on ? 0.9 : 0.4 }} />
              <text
                x={n.x + nw / 2}
                y={n.y + nh / 2 - (n.sub ? 7 : 0)}
                textAnchor="middle"
                className="display"
                style={{ fill: 'var(--text)', fontSize: 15, fontWeight: 600 }}
              >
                {n.label}
              </text>
              {n.sub && (
                <text
                  x={n.x + nw / 2}
                  y={n.y + nh / 2 + 13}
                  textAnchor="middle"
                  className="mono"
                  style={{ fill: 'var(--mute)', fontSize: 10, letterSpacing: '0.04em' }}
                >
                  {n.sub}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* tooltip */}
      {active && tip && active.desc && (
        <div
          className="glass pointer-events-none absolute z-20 w-60 rounded-xl p-3.5 shadow-xl"
          style={{
            left: `${tip.leftPct}%`,
            top: `${tip.topPct}%`,
            transform: tip.below ? 'translate(-50%, 60%)' : 'translate(-50%, calc(-100% - 54px))',
          }}
        >
          <div className="display text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {active.label}
          </div>
          <div className="mt-1.5 text-[12.5px] leading-snug" style={{ color: 'var(--dim)' }}>
            {active.desc}
          </div>
          {neighbors[active.id]?.size > 0 && (
            <div className="mono mt-2.5 border-t border-[var(--line)] pt-2 text-[10px] uppercase tracking-wider" style={{ color: 'var(--mute)' }}>
              ↔ {[...neighbors[active.id]].map((i) => byId[i]?.label).join(' · ')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
