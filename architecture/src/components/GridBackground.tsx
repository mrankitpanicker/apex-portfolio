export default function GridBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse 130% 80% at 50% -10%, #000 5%, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 130% 80% at 50% -10%, #000 5%, transparent 70%)',
          opacity: 0.5,
        }}
      />
      {/* signal glows */}
      <div
        className="absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(94,212,255,0.10), transparent 60%)' }}
      />
      <div
        className="absolute bottom-[-20%] left-[-10%] h-[560px] w-[560px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(79,140,255,0.10), transparent 62%)' }}
      />
    </div>
  )
}
