import GridBackground from './components/GridBackground'
import ScrollProgress from './components/ScrollProgress'
import SideNav from './components/SideNav'
import Hero from './sections/Hero'
import ExecutiveOverview from './sections/ExecutiveOverview'
import SystemArchitecture from './sections/SystemArchitecture'
import AIDecisionPipeline from './sections/AIDecisionPipeline'
import ReliabilityEngineering from './sections/ReliabilityEngineering'
import DeploymentArchitecture from './sections/DeploymentArchitecture'
import ObservabilityLayer from './sections/ObservabilityLayer'
import ProductionMetrics from './sections/ProductionMetrics'
import EngineeringPrinciples from './sections/EngineeringPrinciples'
import Engagement from './sections/Engagement'

function TopBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-[var(--line)]" style={{ background: 'rgba(7,11,18,0.72)', backdropFilter: 'blur(12px)' }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#top" className="flex items-center gap-2.5">
          <svg viewBox="0 0 32 32" className="h-6 w-6">
            <rect width="32" height="32" rx="7" fill="#0e1521" stroke="#1c2940" />
            <path d="M16 6 L25 25 L20.5 25 L16 15 L11.5 25 L7 25 Z" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          <span className="display text-sm font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            AiM<span style={{ color: 'var(--accent)', fontWeight: 400 }}> Studio</span>
          </span>
          <span className="mono ml-1 hidden text-[10px] uppercase tracking-[0.16em] sm:inline" style={{ color: 'var(--mute)' }}>
            / Architecture
          </span>
        </a>
        <div className="mono flex items-center gap-4 text-[11px]" style={{ color: 'var(--dim)' }}>
          <a href="https://aimstudio.co.in/app" target="_blank" rel="noopener" className="hidden items-center gap-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--ok)', boxShadow: '0 0 8px var(--ok)' }} />
            Live
          </a>
          <a href="mailto:mr.ankitpanicker@gmail.com" className="rounded-md border px-3 py-1.5 transition-colors hover:border-[var(--accent)]" style={{ borderColor: 'var(--line-2)', color: 'var(--text)' }}>
            Contact
          </a>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--line)] py-12">
      <div className="mono mx-auto flex max-w-6xl flex-col gap-3 px-6 text-[11px] sm:flex-row sm:items-center sm:justify-between" style={{ color: 'var(--mute)' }}>
        <span>APEX · ARCHITECTURE REVIEW — ENGINEERED BY ANKIT PANICKER / AiM STUDIO</span>
        <span>aimstudio.co.in · Outside IR35 · UK · EU · Remote</span>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="relative min-h-screen" id="top">
      <GridBackground />
      <ScrollProgress />
      <TopBar />
      <SideNav />
      <main className="relative">
        <Hero />
        <ExecutiveOverview />
        <SystemArchitecture />
        <AIDecisionPipeline />
        <ReliabilityEngineering />
        <DeploymentArchitecture />
        <ObservabilityLayer />
        <ProductionMetrics />
        <EngineeringPrinciples />
        <Engagement />
      </main>
      <Footer />
    </div>
  )
}
