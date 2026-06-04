export type Accent = 'cyan' | 'blue' | 'violet' | 'ok' | 'crit'

export const accentVar: Record<Accent, string> = {
  cyan: 'var(--accent)',
  blue: 'var(--accent-2)',
  violet: 'var(--violet)',
  ok: 'var(--ok)',
  crit: 'var(--crit)',
}

export function formatNum(n: number, decimals = 0) {
  return n.toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
