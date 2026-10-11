import React from 'react'
import { C, FONT_STACK, panelCard } from '../theme'
import { cap } from './typeHelpers'

export const Cursor: React.FC<{ x: number; y: number; opacity?: number; click?: boolean }> = ({ x, y, opacity = 1, click = false }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      zIndex: 500,
      opacity,
      transform: `translate(-2px, -2px) scale(${click ? 0.82 : 1})`,
      filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
    }}
  >
    <svg width="26" height="26" viewBox="0 0 24 24">
      <path d="M5 3 L19 12.5 L12.6 13.8 L15.8 20.4 L13.2 21.6 L10 15 L5 19 Z" fill="#fff" stroke="#0B1220" strokeWidth="1.4" />
    </svg>
  </div>
)

export const WidgetCard: React.FC<{
  title: string
  subtitle?: string
  icon?: string
  width?: number
  stat?: string
  statColor?: string
  badge?: string
  style?: React.CSSProperties
}> = ({ title, subtitle, icon = '◈', width = 430, stat, statColor = C.green, badge, style }) => (
  <div
    style={{
      ...panelCard,
      width,
      padding: '18px 20px',
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      background: `linear-gradient(180deg, ${C.panel2}, ${C.panel})`,
      ...style,
    }}
  >
    <div
      style={{
        width: 58,
        height: 58,
        borderRadius: 16,
        display: 'grid',
        placeItems: 'center',
        fontSize: 26,
        color: C.blueHi,
        background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.18))',
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ minWidth: 0, flex: 1 }}>
      <div style={{ fontSize: 17, fontWeight: 750, color: C.text, display: 'flex', gap: 10, alignItems: 'center' }}>
        {title}
        {badge ? (
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: '#04121F', background: C.amber, borderRadius: 6, padding: '3px 7px' }}>{badge}</span>
        ) : null}
      </div>
      {subtitle ? <div style={{ marginTop: 5, fontSize: 13, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</div> : null}
    </div>
    {stat ? (
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 850, color: statColor }}>{stat}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>players</div>
      </div>
    ) : null}
  </div>
)

export const GradientThumb: React.FC<{ w: number; h: number; hue: number; label?: string }> = ({ w, h, hue, label }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 12,
      background: `linear-gradient(135deg, hsl(${hue} 70% 30%), hsl(${(hue + 40) % 360} 80% 22%))`,
      display: 'grid',
      placeItems: 'center',
      color: 'rgba(255,255,255,0.85)',
      fontSize: Math.min(24, h / 3),
      fontWeight: 800,
      letterSpacing: '0.06em',
    }}
  >
    {label ?? ''}
  </div>
)

export const capNum = (v: number) => cap(v)

export { FONT_STACK, cap }
