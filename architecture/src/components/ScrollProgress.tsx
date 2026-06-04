import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
        boxShadow: '0 0 12px var(--accent-glow)',
      }}
    />
  )
}
