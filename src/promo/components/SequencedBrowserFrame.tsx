import React from 'react'
import { AbsoluteFill } from 'remotion'
import { C, FONT_STACK } from '../theme'

export const NAV_ITEMS = ['Resources', 'Servers', 'Streamers', 'Giveaways', 'Hosting', 'Upload'] as const
export type NavItem = (typeof NAV_ITEMS)[number]

/** Nav label → active tab mapping used by scenes */
export const NAV_FOR: Record<string, NavItem> = {
  search: 'Resources',
  trending: 'Resources',
  details: 'Resources',
  montage: 'Resources',
  servers: 'Servers',
  streamers: 'Streamers',
  giveaways: 'Giveaways',
  hosting: 'Hosting',
  submit: 'Upload',
}

export type PageBuilder = (page: NavItem, sceneKey: string, frame: number) => React.ReactNode

export const SequencedBrowserFrame: React.FC<{
  active: NavItem
  sceneKey: string
  frame: number
  buildPage: PageBuilder
  headerSearchValue?: string
  searchWidth?: number
}> = ({ active, sceneKey, frame, buildPage, headerSearchValue = '', searchWidth = 430 }) => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, background: C.ink }}>
      {/* top bar */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '0 28px',
          borderBottom: `1px solid ${C.line}`,
          background: 'rgba(7,11,20,0.92)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 850, fontSize: 19, letterSpacing: '-0.02em', color: C.text }}>
          <div style={{ width: 38, height: 34, position: 'relative', transform: 'skew(-10deg)' }}>
            <div style={{ position: 'absolute', width: 31, height: 9, left: 3, top: 2, borderRadius: 4, background: C.blue, boxShadow: `0 0 22px rgba(59,130,246,0.45)` }} />
            <div style={{ position: 'absolute', width: 11, height: 29, left: 2, top: 3, borderRadius: 4, background: C.blue, boxShadow: `0 0 22px rgba(59,130,246,0.45)` }} />
            <div style={{ position: 'absolute', width: 22, height: 8, left: 7, top: 15, borderRadius: 4, background: C.blue }} />
          </div>
          FiveM Resource Hub
        </div>
        <nav style={{ display: 'flex', gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <div
              key={item}
              style={{
                padding: '9px 15px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 650,
                color: item === active ? C.text : C.muted,
                background: item === active ? 'rgba(59,130,246,0.16)' : 'transparent',
                border: item === active ? `1px solid ${C.line}` : '1px solid transparent',
              }}
            >
              {item}
            </div>
          ))}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: searchWidth,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0 8px 0 15px',
              border: `1px solid ${C.line}`,
              borderRadius: 999,
              background: 'rgba(16,16,22,0.9)',
              color: C.muted,
            }}
          >
            <span style={{ color: C.muted, fontSize: 14 }}>⌕</span>
            <span style={{ fontSize: 13, color: C.text, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {headerSearchValue || <span style={{ color: C.muted }}>Search resources…</span>}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: C.muted, border: `1px solid ${C.line}`, borderRadius: 8, padding: '4px 8px', background: 'rgba(255,255,255,0.04)' }}>
              ⌘K
            </span>
          </div>
          <div
            style={{
              height: 40,
              borderRadius: 999,
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              background: C.blue,
              color: 'white',
              fontWeight: 750,
              fontSize: 14,
              boxShadow: `0 8px 30px rgba(59,130,246,0.22)`,
            }}
          >
            Upload
          </div>
        </div>
      </div>
      {/* page body */}
      <div style={{ position: 'absolute', top: 64, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>{buildPage(active, sceneKey, frame)}</div>
    </AbsoluteFill>
  )
}
