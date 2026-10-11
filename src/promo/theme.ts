import type { CSSProperties } from 'react'

// Palette lifted from fivem-resource-hub apps/web (styles.css + ResourceGalaxy.css)
export const C = {
  ink: '#070B14',
  panel: '#0B1220',
  panel2: '#111827',
  text: '#F8FAFC',
  muted: '#94A3B8',
  line: 'rgba(59,130,246,0.22)',
  lineStrong: 'rgba(59,130,246,0.55)',
  blue: '#3B82F6',
  blueHi: '#4F8EF7',
  cyan: '#55E3FF',
  green: '#34D399',
  fire: '#FB7185',
  amber: '#FBBF24',
} as const

export const FONT_STACK = '"Inter", "Segoe UI", system-ui, sans-serif'

export const panelCard: CSSProperties = {
  background: `linear-gradient(180deg, ${C.panel2}, ${C.panel})`,
  border: `1px solid ${C.line}`,
  borderRadius: 16,
}

export const displayTitle = (size: number): CSSProperties => ({
  fontWeight: 800,
  letterSpacing: '-0.03em',
  lineHeight: 1.02,
  fontSize: size,
  color: C.text,
  textShadow: '0 2px 24px rgba(7,11,20,0.55)',
})

export const kicker = (size = 20): CSSProperties => ({
  fontWeight: 700,
  fontSize: size,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: C.cyan,
})
