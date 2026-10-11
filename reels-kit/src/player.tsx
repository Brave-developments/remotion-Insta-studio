import {AbsoluteFill, Audio, Composition, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import type {ReactNode} from 'react';
import {BrowserWindow, BeforeAfter, Checklist, CodeEditor, ConnectorLine, Counter, Cursor, DiagramNode, MetricCard, PhoneFrame, ProgressBar, RetentionGraph, TimelineBlocks, TypingText} from './components';
import {CameraWrapper, ease, Heading, Label, Note, panelStyle, SceneShell, Stage, span, clamp01} from './primitives';
import type {Caption, Project, Reel, Scene} from './types';
import {EditorialMotion} from '../../studio-kit/src/EditorialMotion';
import {EDITORIAL_PALETTE as ep, EDITORIAL_NEUTRALS as en} from '../../studio-kit/src/editorialPalette';

const mono = 'Consolas, "Cascadia Code", monospace';

/* -------------------------------------------------------------- backdrop */

const Backdrop = ({project, children, draft, syncNote}: {project: Project; children: ReactNode; draft: boolean; syncNote: string}) => (
  <AbsoluteFill
    style={{
      background: project.palette.background,
      color: project.palette.text,
      fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
      overflow: 'hidden',
    }}
  >
    <AbsoluteFill
      style={{background: `radial-gradient(ellipse at 68% 30%, ${project.palette.accent}12, transparent 62%)`}}
    />
    <div
      style={{
        position: 'absolute',
        left: 84,
        right: 84,
        top: 74,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: mono,
        fontSize: 20,
        letterSpacing: 3,
        color: project.palette.muted,
      }}
    >
      <span>{project.name}</span>
      <span>{draft ? 'SCRIPT DRAFT' : 'FINAL'}</span>
    </div>
    <div style={{position: 'absolute', left: 36, right: 36, top: 124, height: 1, background: `${project.palette.muted}33`}} />
    {children}
    <div style={{position: 'absolute', left: 84, right: 84, bottom: 78, fontSize: 18, letterSpacing: 1, color: `${project.palette.muted}cc`, textAlign: 'center'}}>
      {draft ? syncNote : project.position}
    </div>
  </AbsoluteFill>
);

/* --------------------------------------------------------------- captions */

const Captions = ({project, captions, duration, scenes}: {project: Project; captions: Caption[]; duration: number; scenes: Scene[]}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const editorial = scenes.some((s) => s.editorial?.template === 'editorial-motion' && t >= s.start && t < s.end);
  if (t >= duration) return null;
  const cue = captions.find((c) => t >= c.start && t < c.end);
  if (!cue) return null;
  const words = cue.text.split(/\s+/);
  const emphasis = cue.emphasis?.toLowerCase().replace(/[^\w]/g, '');
  return (
    <div style={{position: 'absolute', left: 150, right: 150, bottom: 168, textAlign: 'center', zIndex: 40}}>
      <div
        style={{
          display: 'block',
          width: 'fit-content',
          maxWidth: '100%',
          boxSizing: 'border-box',
          margin: '0 auto',
          fontSize: 40,
          lineHeight: 1.3,
          fontWeight: 600,
          padding: '16px 24px',
          borderRadius: 14,
          background: editorial ? ep.white : `${project.palette.background}f2`,
          color: editorial ? en.text : project.palette.text,
          border: `1px solid ${editorial ? en.border : project.palette.muted+'33'}`,
          overflowWrap: 'anywhere',
        }}
      >
        {words.map((word, i) => {
          const clean = word.toLowerCase().replace(/[^\w]/g, '');
          const hot = !!emphasis && clean === emphasis;
          return (
            <span key={`${word}-${i}`} style={{marginRight: 12}}>
              <span
                style={{
                  color: hot ? (editorial ? en.text : project.palette.accent) : undefined,
                  fontWeight: hot ? 800 : undefined,
                  textDecoration: hot ? 'underline' : undefined,
                  textUnderlineOffset: 6,
                }}
              >
                {word}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ scene bodies */

const visualProgress = (frame: number, duration: number) => clamp01(frame / Math.max(1, duration));

const VisualBody = ({project, scene, duration}: {project: Project; scene: Scene; duration: number}) => {
  const frame = useCurrentFrame();
  const v = scene.visual ?? {};
  const p = visualProgress(frame, duration);
  const accent = project.palette.accent;

  switch (scene.type) {
    case 'hook': {
      const sweep = ease(frame, 6, 34, 0, 100);
      return (
        <div>
          <Heading size={scene.text.length > 40 ? 76 : 96}>{scene.text}</Heading>
          <div style={{height: 8, width: `${sweep}%`, background: accent, marginTop: 34, borderRadius: 8}} />
          {v.note ? <Note project={project}>{v.note}</Note> : null}
          <div style={{display: 'flex', gap: 14, marginTop: 46}}>
            {(v.items ?? ['PROBLEM', 'PROOF', 'PAYOFF']).map((item, i) => (
              <div
                key={item}
                style={{
                  ...panelStyle(project),
                  padding: '18px 24px',
                  fontSize: 22,
                  letterSpacing: 2,
                  fontFamily: mono,
                  color: p > (i + 1) / 4 ? accent : project.palette.muted,
                  opacity: p > i / 5 ? 1 : 0.35,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'graph':
      return (
        <div>
          <Heading size={78}>{scene.text}</Heading>
          <div style={{marginTop: 40}}>
            <RetentionGraph project={project} drops={v.drops ?? [18, 52, 84]} progress={p} patched={v.label === 'PATCHED'} />
          </div>
        </div>
      );

    case 'timeline':
      return (
        <div>
          <Label project={project}>{v.label ?? 'STRUCTURE'}</Label>
          <Heading size={scene.text.length > 36 ? 68 : 82}>{scene.text}</Heading>
          <div style={{marginTop: 48}}>
            <TimelineBlocks project={project} items={v.items ?? ['HOOK', 'CONTEXT', 'VALUE']} progress={p} />
          </div>
          <div style={{marginTop: 40}}>
            <ProgressBar project={project} progress={p} label="EDIT TIMELINE" />
          </div>
          {v.note ? <Note project={project}>{v.note}</Note> : null}
        </div>
      );

    case 'browser':
      return (
        <div>
          <Heading size={scene.text.length > 36 ? 66 : 80}>{scene.text}</Heading>
          <div style={{marginTop: 40, position: 'relative'}}>
            <BrowserWindow project={project} title={v.label ?? 'search — demo interface'}>
              <div style={{padding: '30px 34px', position: 'relative', minHeight: 360}}>
                <div
                  style={{
                    ...panelStyle(project),
                    borderRadius: 999,
                    padding: '20px 30px',
                    fontSize: 27,
                    color: accent,
                    boxShadow: 'none',
                  }}
                >
                  <TypingText text={v.a ?? 'invoice export'} start={8} end={46} color={accent} />
                </div>
                <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 16}}>
                  {(v.items ?? ['Export invoices', 'Bulk download CSV', 'Scheduled reports']).map((row, i) => (
                    <div
                      key={row}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '20px 26px',
                        borderRadius: 12,
                        background: project.palette.background,
                        border: `1px solid ${project.palette.muted}33`,
                        opacity: ease(frame, 50 + i * 7, 66 + i * 7, 0, 1),
                      }}
                    >
                      <span style={{fontSize: 26}}>{row}</span>
                      <span style={{fontFamily: mono, fontSize: 20, color: accent}}>{i === 0 ? 'BEST MATCH' : `0.${9 - i}s`}</span>
                    </div>
                  ))}
                </div>
                <Cursor x={ease(frame, 10, 44, 700, 240)} y={ease(frame, 10, 44, 300, 96)} click={frame > 44 && frame < 54} color={accent} />
              </div>
            </BrowserWindow>
            <div style={{fontFamily: mono, fontSize: 19, color: project.palette.muted, marginTop: 18}}>
              FICTIONAL INTERFACE — DEMONSTRATION, NOT A REAL PRODUCT SCREENSHOT
            </div>
          </div>
        </div>
      );

    case 'phone':
      return (
        <div>
          <Heading size={scene.text.length > 36 ? 66 : 80}>{scene.text}</Heading>
          <div style={{marginTop: 36}}>
            <PhoneFrame project={project}>
              <div style={{fontSize: 28, fontWeight: 700, lineHeight: 1.25}}>{v.label ?? 'EMPTY STATE'}</div>
              <div style={{height: 3, width: `${ease(frame, 8, 40, 0, 100)}%`, background: accent, margin: '26px 0'}} />
              {(v.items ?? ['Explain what belongs here', 'Give one first action', 'Show a small example']).map((item, i) => (
                <div
                  key={item}
                  style={{
                    fontSize: 23,
                    padding: '18px 20px',
                    marginBottom: 16,
                    borderRadius: 12,
                    background: project.palette.background,
                    border: `1px solid ${project.palette.muted}33`,
                    opacity: ease(frame, 18 + i * 9, 34 + i * 9, 0, 1),
                  }}
                >
                  {item}
                </div>
              ))}
            </PhoneFrame>
          </div>
        </div>
      );

    case 'compare':
      return (
        <div>
          <Label project={project}>{v.label ?? 'BEFORE / AFTER'}</Label>
          <Heading size={scene.text.length > 36 ? 66 : 80}>{scene.text}</Heading>
          <div style={{marginTop: 42}}>
            <BeforeAfter project={project} a={v.a ?? 'Weak version'} b={v.b ?? 'Strong version'} progress={ease(frame, 14, duration - 12, 0, 1)} />
          </div>
          {v.note ? <Note project={project}>{v.note}</Note> : null}
        </div>
      );

    case 'code':
      return (
        <div>
          <Heading size={scene.text.length > 36 ? 64 : 78}>{scene.text}</Heading>
          <div style={{marginTop: 38}}>
            <CodeEditor project={project} file={v.file ?? 'example.ts'} code={v.code ?? ['const ok = await run(task);', 'assert(ok.passed);']} highlight={v.highlight ?? []} />
          </div>
          {v.note ? <Note project={project}>{v.note}</Note> : null}
        </div>
      );

    case 'counter':
      return (
        <div>
          <Label project={project}>{v.label ?? 'MEASURED'}</Label>
          <Heading size={scene.text.length > 36 ? 66 : 82}>{scene.text}</Heading>
          <div style={{marginTop: 44}}>
            <Counter from={v.from ?? 0} to={v.to ?? 100} prefix={v.prefix} suffix={v.suffix} start={6} end={Math.max(30, duration - 14)} color={accent} size={130} />
          </div>
          <div style={{display: 'flex', gap: 20, marginTop: 46}}>
            {(v.items ?? ['Baseline', 'Change', 'Result']).map((item, i) => (
              <MetricCard key={item} project={project} label={item.toUpperCase()} accent={i === 2} />
            ))}
          </div>
          {v.note ? <Note project={project}>{v.note}</Note> : null}
        </div>
      );

    case 'diagram': {
      const nodes = v.items ?? ['IDEA', 'SCRIPT', 'ASSETS', 'RENDER'];
      const active = Math.min(nodes.length, Math.floor(p * (nodes.length + 1)));
      return (
        <div>
          <Label project={project}>{v.label ?? 'PIPELINE'}</Label>
          <Heading size={scene.text.length > 36 ? 64 : 78}>{scene.text}</Heading>
          <div style={{marginTop: 50, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap'}}>
            {nodes.map((node, i) => (
              <div key={node} style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <DiagramNode project={project} label={node} active={active} index={i} />
                {i < nodes.length - 1 ? <ConnectorLine project={project} progress={clamp01(active - i)} length={70} /> : null}
              </div>
            ))}
          </div>
          <div style={{marginTop: 44}}>
            <ProgressBar project={project} progress={p} label="PROGRESS" />
          </div>
          {v.note ? <Note project={project}>{v.note}</Note> : null}
        </div>
      );
    }

    case 'checklist':
      return (
        <div>
          <Label project={project}>{v.label ?? 'VERIFY'}</Label>
          <Heading size={scene.text.length > 36 ? 64 : 78}>{scene.text}</Heading>
          <div style={{marginTop: 44}}>
            <Checklist project={project} items={v.items ?? ['Test', 'Logs', 'Browser', 'Review']} progress={p} />
          </div>
        </div>
      );

    case 'payoff':
    default: {
      const lock = ease(frame, 10, 40, 0, 100);
      return (
        <div>
          <Label project={project}>{v.label ?? 'TAKEAWAY'}</Label>
          <Heading size={scene.text.length > 36 ? 72 : 94}>{scene.text}</Heading>
          <div style={{height: 8, width: `${lock}%`, background: accent, marginTop: 32, borderRadius: 8}} />
          {v.note ? <Note project={project}>{v.note}</Note> : null}
          <div style={{...panelStyle(project), marginTop: 48, padding: '30px 34px', fontSize: 30, fontWeight: 650}}>
            {v.a ?? project.position}
          </div>
        </div>
      );
    }
  }
};

/* ------------------------------------------------------------------ scene */

const SceneBody = ({project, scene}: {project: Project; scene: Scene}) => {
  const duration = Math.max(1, (scene.end - scene.start) * 30);
  return (
    <SceneShell scene={scene}>
      <CameraWrapper scene={scene}>
        <Stage>
          {scene.type === 'hook' || scene.type === 'payoff' ? null : (
            <Label project={project}>{scene.visual?.label ?? scene.type.toUpperCase()}</Label>
          )}
          <VisualBody project={project} scene={scene} duration={duration} />
        </Stage>
      </CameraWrapper>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------- reel */

export type SeasonReelProps = {project: Project; reel: Reel};

export const SeasonReel = ({project, reel}: SeasonReelProps) => {
  const duration = Math.round(reel.durationSeconds * 30);
  return (
    <Backdrop
      project={project}
      draft={!reel.productionReady}
      syncNote={
        reel.audio
          ? 'SCENES SCALED TO THE MEASURED VOICE-OVER · WORD-LEVEL SYNC NOT YET AUTHORED'
          : 'TIMINGS ESTIMATED FROM SCRIPT · NO VOICE-OVER ATTACHED'
      }
    >
      {reel.scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={Math.round(scene.start * 30)}
          durationInFrames={Math.max(1, Math.round((scene.end - scene.start) * 30))}
          name={scene.id}
        >
          {scene.editorial?.template === 'editorial-motion' ? (
            <>
              {scene.editorial.layout === 'upper' ? (
                <div style={{position:'absolute',top:1160,bottom:0,left:0,right:0,background:ep.white}}>
                  {scene.editorial.presenterAsset ? (
                    <OffthreadVideo muted src={staticFile(scene.editorial.presenterAsset)}
                      style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  ) : null}
                </div>
              ) : null}
              <EditorialMotion mode={scene.editorial.mode} layout={scene.editorial.layout ?? 'full'}
                headline={scene.editorial.headline ?? scene.text} subheadline={scene.editorial.subheadline}
                emphasis={scene.editorial.emphasis} items={scene.editorial.items}/>
            </>
          ) : <SceneBody project={project} scene={scene}/>}
        </Sequence>
      ))}
      <Captions project={project} captions={reel.captions} duration={reel.durationSeconds} scenes={reel.scenes} />
      {reel.audio ? <Audio src={staticFile(reel.audio)} /> : null}
    </Backdrop>
  );
};

/* ------------------------------------------------------------------- root */

/** Registers every reel in a bank as its own composition. */
export const SeasonCompositions = ({project, reels}: {project: Project; reels: Reel[]}) => (
  <>
    {reels.map((reel) => (
      <Composition
        key={reel.id}
        id={reel.id}
        component={SeasonReel}
        durationInFrames={Math.round(reel.durationSeconds * 30)}
        calculateMetadata={({props}) => ({durationInFrames: Math.round(props.reel.durationSeconds * 30)})}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{project, reel}}
      />
    ))}
  </>
);
