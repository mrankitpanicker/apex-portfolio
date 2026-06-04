import Section from '../components/Section'
import FlowDiagram from '../components/FlowDiagram'
import { obsGraph } from '../lib/data'

const health = [
  { k: 'ETTSA p95', v: '480ms', ok: true },
  { k: 'Breaker state', v: 'CLOSED', ok: true },
  { k: 'Queue depth', v: 'nominal', ok: true },
  { k: 'API pods', v: '2 / 2 up', ok: true },
]

function Spark() {
  const bars = [40, 62, 48, 70, 55, 80, 60, 74, 52, 68, 58, 76]
  return (
    <div className="flex h-8 items-end gap-[3px]">
      {bars.map((b, i) => (
        <span
          key={i}
          className="w-[5px] rounded-sm"
          style={{
            height: `${b}%`,
            background: 'linear-gradient(var(--accent), var(--accent-2))',
            opacity: 0.85,
            animation: `bar 1.6s ease-in-out ${i * 0.09}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function ObservabilityLayer() {
  return (
    <Section
      id="observability"
      index="06"
      eyebrow="Observability Layer"
      title={<>Four signals, <span style={{ color: 'var(--accent)' }}>one instrumented runtime.</span></>}
      kicker="Metrics, logs, traces and alerting all emit from the same process. When something degrades, the alert fires with the context to diagnose it. Hover the graph."
    >
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="glass rounded-2xl p-5 md:p-7">
          <FlowDiagram diagram={obsGraph} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {health.map((m) => (
            <div key={m.k} className="glass flex flex-col justify-between rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--mute)' }}>{m.k}</span>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: 'var(--ok)', animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite' }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: 'var(--ok)' }} />
                </span>
              </div>
              <div className="display my-2 text-lg font-semibold" style={{ color: 'var(--text)' }}>{m.v}</div>
              <Spark />
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes bar{0%,100%{transform:scaleY(0.6)}50%{transform:scaleY(1)}}@keyframes ping{75%,100%{transform:scale(2.4);opacity:0}}`}</style>
    </Section>
  )
}
