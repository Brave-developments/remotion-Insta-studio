import React from 'react';
import {CameraWrapper, Layer, SceneShell, clamp01, easeOutQuint, span, useLocal} from '../motion';
import {Cutout, Icon} from '../assets';
import {Cursor, KeyCap, TypingInput, typingSchedule} from '../interaction';
import {BrowserFrame, STAGE_WIDTH} from '../objects';
import {accentSoft, C} from '../theme';
import type {BrowserSceneData, SceneProps, TaskFlowSceneData} from '../types';

/* ------------------------------------------------------------------ */
/* 5. "Research the best laptop under $1,500."                         */
/*     Cursor moves in, clicks the box, the request is typed in time    */
/*     with the narration, Enter is pressed, the agent starts working.  */
/* ------------------------------------------------------------------ */

export const BrowserScene: React.FC<SceneProps> = ({entry}) => {
  const scene = entry.scene as BrowserSceneData;
  const local = useLocal(entry);
  const accent = '#3B82F6';

  const schedule = React.useMemo(
    () => typingSchedule(scene.prompt, 44, 21),
    [scene.prompt],
  );
  const typedDone = local >= (schedule[schedule.length - 1] ?? 0);
  const enterAt = 134;
  const submitted = local >= enterAt;

  const cursorPath = [
    {at: 4, x: 812, y: 610},
    {at: 26, x: 118, y: 236},
    {at: 112, x: 470, y: 352},
    {at: 140, x: 560, y: 470},
  ];

  return (
    <SceneShell entry={entry}>
      <CameraWrapper
        entry={entry}
        from={{scale: 1.16, y: 40, rotateX: 6}}
        to={{scale: 1.0, y: -10, rotateX: 0}}
      >
        <Layer depth={1.1} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{position: 'relative', width: STAGE_WIDTH}}>
            <BrowserFrame url={scene.url ?? 'agent.run'} tab="agent research" accent={accent}>
              {/* the AI input */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  padding: submitted ? '18px 22px' : '22px 24px',
                  background: submitted ? accentSoft(accent, 0.1) : C.bgSoft,
                  border: `1.5px solid ${submitted ? accent : C.border}`,
                  borderRadius: 20,
                  boxShadow: submitted ? `0 0 0 5px ${accentSoft(accent, 0.14)}` : undefined,
                  transition: 'none',
                }}
              >
                <span
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 15,
                    background: accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  <Icon name="sparkles" size={26} />
                </span>
                <span style={{flex: 1, minWidth: 0, color: C.text, overflow: 'hidden'}}>
                  <TypingInput
                    local={local}
                    schedule={schedule}
                    text={scene.prompt}
                    accent={accent}
                    size={33}
                  />
                </span>
              </div>

              {/* enter key */}
              <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 22}}>
                <KeyCap label="Enter" pressed={span(local, enterAt, enterAt + 8)} accent={accent} />
                <span
                  style={{
                    fontSize: 24,
                    color: submitted ? C.textDim : C.textFaint,
                    opacity: clamp01(span(local, enterAt + 6, enterAt + 22, easeOutQuint)),
                  }}
                >
                  {submitted ? 'agent is working' : typedDone ? 'ready to run' : 'describe the task'}
                </span>
              </div>

              {/* processing steps */}
              <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 26}}>
                {(scene.steps ?? []).map((label, i) => {
                  const at = enterAt + 10 + i * 10;
                  const p = span(local, at, at + 16, easeOutQuint);
                  if (p <= 0.004) return null;
                  const done = span(local, at + 22, at + 36, easeOutQuint);
                  return (
                    <div
                      key={label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 15,
                        opacity: p,
                        transform: `translateX(${((1 - p) * -26).toFixed(2)}px)`,
                      }}
                    >
                      <span
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          background: done > 0.9 ? accentSoft(accent, 0.3) : C.surfaceRaised,
                          border: `1px solid ${done > 0.9 ? accent : C.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {done > 0.9 ? (
                          <Icon name="circle-check" size={19} color={accent} />
                        ) : (
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: 5,
                              background: accent,
                              transform: `scale(${(0.6 + 0.4 * Math.abs(Math.sin(local / 5))).toFixed(3)})`,
                            }}
                          />
                        )}
                      </span>
                      <span style={{fontSize: 27, fontWeight: 550, color: C.textDim}}>{label}</span>
                    </div>
                  );
                })}
              </div>

              {(scene.results ?? []).length > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginTop: 24,
                    opacity: clamp01(span(local, enterAt + 34, enterAt + 52, easeOutQuint)),
                  }}
                >
                  <Icon name="checks" size={24} color={C.green} />
                  <span style={{fontSize: 25, fontWeight: 650, color: C.green}}>
                    {(scene.results ?? []).length} results ready
                  </span>
                </div>
              ) : null}
            </BrowserFrame>

            <Cursor
              local={local}
              path={cursorPath}
              clickAt={[28, 134]}
              fadeAt={148}
              accent={accent}
            />
          </div>
        </Layer>
      </CameraWrapper>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ */
/* 6. "... browse websites, compare products, organise the results..." */
/*     Tabs switch, the checklist ticks itself off, then the shortlist  */
/*     fans out as objects with price bars counting into place.         */
/* ------------------------------------------------------------------ */

export const TaskFlowScene: React.FC<SceneProps> = ({entry}) => {
  const scene = entry.scene as TaskFlowSceneData;
  const local = useLocal(entry);
  const accent = '#4ADE80';

  const tabs = scene.tabs ?? [];
  const tasks = scene.tasks ?? [];
  const compare = scene.compare ?? [];

  const activeTab = Math.min(
    tabs.length - 1,
    Math.max(0, Math.floor(clamp01((local - 26) / 34) * tabs.length)),
  );
  const showCompare = span(local, 96, 120, easeOutQuint);
  const maxPrice = Math.max(...compare.map((c) => c.price), 1);

  return (
    <SceneShell entry={entry} align="left">
      <CameraWrapper
        entry={entry}
        from={{scale: 1.0, x: -50, rotateY: 4}}
        to={{scale: 1.14, x: 40, rotateY: -5}}
      >
        {/* far plane: supplied cut-outs fanning out behind the interface */}
        <Layer depth={0.5} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{display: 'flex', gap: 26, opacity: showCompare * 0.55}}>
            {['folders', 'chart', 'contract'].map((name, i) => (
              <div
                key={name}
                style={{
                  transform: `translateY(${((1 - showCompare) * 90 + i * 22).toFixed(1)}px) rotate(${
                    (i - 1) * 7
                  }deg)`,
                }}
              >
                <Cutout name={name} width={230} shadow={false} />
              </div>
            ))}
          </div>
        </Layer>

        <Layer depth={1.15} style={{display: 'flex', alignItems: 'center'}}>
          <div style={{width: '100%'}}>
            {/* tab strip */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                position: 'relative',
                borderBottom: `2px solid ${C.border}`,
                paddingBottom: 4,
              }}
            >
              {tabs.map((t, i) => {
                const on = i === activeTab;
                return (
                  <span
                    key={t}
                    style={{
                      padding: '13px 26px',
                      borderRadius: '14px 14px 0 0',
                      background: on ? C.surfaceRaised : 'transparent',
                      border: `1px solid ${on ? C.border : 'transparent'}`,
                      borderBottom: 'none',
                      fontSize: 27,
                      fontWeight: on ? 750 : 550,
                      color: on ? C.text : C.textFaint,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {t}
                  </span>
                );
              })}
              <span
                style={{
                  position: 'absolute',
                  bottom: -2,
                  height: 4,
                  borderRadius: 3,
                  background: accent,
                  width: 132,
                  transform: `translateX(${(activeTab * 144 + 6).toFixed(1)}px)`,
                }}
              />
            </div>

            {/* checklist */}
            <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 30}}>
              {tasks.map((t, i) => {
                const p = span(local, 8 + i * 15, 30 + i * 15, easeOutQuint);
                const tick = span(local, 44 + i * 13, 60 + i * 13, easeOutQuint);
                if (p <= 0.004) return null;
                return (
                  <div
                    key={t.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      padding: '20px 26px',
                      borderRadius: 18,
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      opacity: p,
                      transform: `translateX(${((1 - p) * -40).toFixed(2)}px)`,
                    }}
                  >
                    <span
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 16,
                        background: tick > 0.9 ? accentSoft(accent, 0.22) : C.surfaceRaised,
                        border: `1px solid ${tick > 0.9 ? accent : C.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: tick > 0.9 ? accent : C.textDim,
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={tick > 0.9 ? 'circle-check' : t.icon} size={30} />
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 37,
                        fontWeight: 650,
                        color: tick > 0.9 ? C.text : C.textDim,
                        letterSpacing: '-0.02em',
                        textDecoration: tick > 0.9 ? 'none' : 'none',
                      }}
                    >
                      {t.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* price comparison — data visualisation, not just text */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                marginTop: 30,
                opacity: showCompare,
                transform: `translateY(${((1 - showCompare) * 40).toFixed(2)}px)`,
              }}
            >
              {compare.map((row, i) => {
                const p = span(local, 104 + i * 12, 130 + i * 12, easeOutQuint);
                const w = (row.price / maxPrice) * 100;
                return (
                  <div key={row.name} style={{position: 'relative'}}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        marginBottom: 9,
                        opacity: p,
                      }}
                    >
                      <span style={{fontSize: 28, fontWeight: 700, color: C.text}}>
                        {row.name}
                        <span style={{color: C.textFaint, fontWeight: 500}}> · {row.spec}</span>
                      </span>
                      <span
                        style={{
                          fontSize: 31,
                          fontWeight: 800,
                          color: row.best ? accent : C.textDim,
                          letterSpacing: '-0.03em',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        ${Math.round(row.price * p).toLocaleString('en-US')}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 16,
                        borderRadius: 9,
                        background: C.surfaceRaised,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${(w * p).toFixed(2)}%`,
                          height: '100%',
                          borderRadius: 9,
                          background: row.best ? accent : C.border,
                          boxShadow: row.best ? `0 0 22px ${accentSoft(accent, 0.5)}` : undefined,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Layer>
      </CameraWrapper>
    </SceneShell>
  );
};
