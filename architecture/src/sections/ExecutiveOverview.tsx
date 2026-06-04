import Section from '../components/Section'
import FlowDiagram from '../components/FlowDiagram'
import { execFlow } from '../lib/data'

export default function ExecutiveOverview() {
  return (
    <Section
      id="overview"
      index="01"
      eyebrow="Executive Overview"
      title={<>The business flow, <span style={{ color: 'var(--accent)' }}>at a glance.</span></>}
      kicker="What actually happens when a patient calls a clinic — from the phone ringing to the appointment booked. Hover any stage to see what it does and what it connects to."
    >
      <div className="glass rounded-2xl p-6 md:p-10">
        <FlowDiagram diagram={execFlow} />
      </div>
      <div className="mono mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--mute)' }}>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }} />
          live request tracing
        </span>
        <span>hover a node to isolate its path · keyboard accessible</span>
      </div>
    </Section>
  )
}
