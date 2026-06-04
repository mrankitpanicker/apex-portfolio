import { animate, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { formatNum } from '../lib/ui'

interface Props {
  to: number
  prefix?: string
  suffix?: string
  decimals?: number
}

export default function Counter({ to, prefix = '', suffix = '', decimals = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.5,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to])

  return (
    <span ref={ref} className="tnum">
      {prefix}
      {formatNum(val, decimals)}
      {suffix}
    </span>
  )
}
