import raw from './reel.json';
import {
  SCENE_TYPES,
  type CaptionAnchor,
  type CaptionCue,
  type CaptionStyle,
  type Phase,
  type Reel,
  type SceneData,
  type SceneType,
  type TimelineEntry,
} from '../types';
import {type AccentKey, ACCENT} from '../theme';

/**
 * Declared as a function (not an arrow const) so TypeScript treats calls to it
 * as never-returning and narrows the guarded value afterwards.
 */
function fail(msg: string): never {
  throw new Error(`[src/video/data/reel.json] ${msg}`);
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const asString = (v: unknown, path: string): string => {
  if (typeof v !== 'string' || v.trim() === '') fail(`${path} must be a non-empty string`);
  return v;
};

const asNumber = (v: unknown, path: string): number => {
  if (typeof v !== 'number' || !Number.isFinite(v)) fail(`${path} must be a finite number`);
  return v;
};

const asArray = (v: unknown, path: string): unknown[] => {
  if (!Array.isArray(v)) fail(`${path} must be an array`);
  return v;
};

const MIN_CUE_WORDS = 3;
const MAX_CUE_WORDS = 8;

function validateScene(value: unknown, index: number): SceneData {
  const path = `scenes[${index}]`;
  if (!isRecord(value)) fail(`${path} must be an object`);

  const type = value.type;
  if (typeof type !== 'string' || !(SCENE_TYPES as readonly string[]).includes(type)) {
    fail(`${path}.type must be one of ${SCENE_TYPES.join(', ')} (got ${JSON.stringify(type)})`);
  }

  asString(value.id, `${path}.id`);
  const start = asNumber(value.start, `${path}.start`);
  const end = asNumber(value.end, `${path}.end`);
  if (end <= start) fail(`${path} must have end > start`);

  asString(value.narration, `${path}.narration`);
  asString(value.concept, `${path}.concept`);

  if (value.accent !== undefined && !Object.hasOwn(ACCENT, value.accent as string)) {
    fail(`${path}.accent must be one of ${Object.keys(ACCENT).join(', ')}`);
  }
  if (value.assets !== undefined) asArray(value.assets, `${path}.assets`);
  if (value.captionAnchor !== undefined) {
    const anchors: CaptionAnchor[] = ['bottom', 'top', 'top-left', 'bottom-left'];
    if (!anchors.includes(value.captionAnchor as CaptionAnchor)) {
      fail(`${path}.captionAnchor must be one of ${anchors.join(', ')}`);
    }
  }
  if (value.captionStyle !== undefined) {
    const styles: CaptionStyle[] = ['box', 'underline', 'weight', 'tint'];
    if (!styles.includes(value.captionStyle as CaptionStyle)) {
      fail(`${path}.captionStyle must be one of ${styles.join(', ')}`);
    }
  }

  const requirePhases = () => {
    if (!Array.isArray(value.phases) || value.phases.length === 0) {
      fail(`${path} needs a "phases" array`);
    }
    (value.phases as unknown[]).forEach((p, i) => {
      if (!isRecord(p)) fail(`${path}.phases[${i}] must be an object`);
      asString(p.text, `${path}.phases[${i}].text`);
    });
  };

  switch (type as SceneType) {
    case 'particle':
      asString(value.word, `${path}.word`);
      break;
    case 'chat':
      asString(value.title, `${path}.title`);
      asArray(value.messages, `${path}.messages`);
      break;
    case 'network':
      if (value.variant !== 'network' && value.variant !== 'hub') {
        fail(`${path}.variant must be "network" or "hub"`);
      }
      asString(value.center, `${path}.center`);
      asArray(value.nodes, `${path}.nodes`);
      break;
    case 'diagram':
      asArray(value.queued, `${path}.queued`);
      asArray(value.steps, `${path}.steps`);
      break;
    case 'browser':
      asString(value.prompt, `${path}.prompt`);
      asArray(value.results, `${path}.results`);
      break;
    case 'taskflow':
      asArray(value.tabs, `${path}.tabs`);
      asArray(value.tasks, `${path}.tasks`);
      asArray(value.compare, `${path}.compare`);
      break;
    case 'kinetic':
      asString(value.text, `${path}.text`);
      break;
    case 'device':
      asString(value.app, `${path}.app`);
      asArray(value.rows, `${path}.rows`);
      break;
    case 'race':
      asArray(value.runners, `${path}.runners`);
      break;
    case 'comparison':
      if (!isRecord(value.left)) fail(`${path}.left is required`);
      if (!isRecord(value.right)) fail(`${path}.right is required`);
      break;
    case 'code':
      asString(value.file, `${path}.file`);
      asArray(value.lines, `${path}.lines`);
      asArray(value.capabilities, `${path}.capabilities`);
      break;
    case 'apps':
      asArray(value.tiles, `${path}.tiles`);
      asString(value.command, `${path}.command`);
      if (!Array.isArray(value.labels) || value.labels.length !== 2) {
        fail(`${path}.labels must be a [from, to] pair`);
      }
      break;
    case 'outro':
      requirePhases();
      break;
  }

  if (value.phases !== undefined) requirePhases();

  return value as unknown as SceneData;
}

function validateCue(value: unknown, index: number): CaptionCue {
  const path = `captions[${index}]`;
  if (!isRecord(value)) fail(`${path} must be an object`);

  const start = asNumber(value.start, `${path}.start`);
  const end = asNumber(value.end, `${path}.end`);
  if (end <= start) fail(`${path} must have end > start`);

  const words = asArray(value.words, `${path}.words`).map((w, i) => {
    if (!isRecord(w)) fail(`${path}.words[${i}] must be an object`);
    return {text: asString(w.text, `${path}.words[${i}].text`), hl: w.hl === true};
  });

  if (words.length < MIN_CUE_WORDS || words.length > MAX_CUE_WORDS) {
    fail(`${path} has ${words.length} words; captions must show ${MIN_CUE_WORDS}-${MAX_CUE_WORDS}`);
  }

  return {start, end, words};
}

function validate(data: unknown): Reel {
  if (!isRecord(data)) fail('root must be an object');
  const meta = data.meta;
  if (!isRecord(meta)) fail('"meta" is required');

  const durationSeconds = asNumber(meta.durationSeconds, 'meta.durationSeconds');
  const fps = asNumber(meta.fps, 'meta.fps');
  const leadFrames = asNumber(meta.leadFrames, 'meta.leadFrames');
  asString(meta.timingSource, 'meta.timingSource');

  const scenes = asArray(data.scenes, 'scenes').map(validateScene);
  const captions = asArray(data.captions, 'captions').map(validateCue);
  if (scenes.length === 0) fail('"scenes" must not be empty');

  // Narration must be covered continuously with no gaps or overlaps — the
  // narration is the master timeline, so scene boundaries have to be exact.
  if (scenes[0].start !== 0) fail(`scenes[0] starts at ${scenes[0].start}s, expected 0`);
  scenes.forEach((s, i) => {
    if (i > 0 && s.start !== scenes[i - 1].end) {
      fail(
        `scenes[${i}] (${s.id}) starts at ${s.start}s but scenes[${i - 1}] ends at ${
          scenes[i - 1].end
        }s`,
      );
    }
  });
  const last = scenes[scenes.length - 1];
  if (Math.abs(last.end - durationSeconds) > 1e-9) {
    fail(`last scene ends at ${last.end}s but meta.durationSeconds is ${durationSeconds}s`);
  }

  captions.forEach((c, i) => {
    if (c.start < 0 || c.end > durationSeconds + 1e-9) {
      fail(`captions[${i}] falls outside 0-${durationSeconds}s`);
    }
    if (i > 0 && c.start < captions[i - 1].end - 1e-9) {
      fail(`captions[${i}] overlaps captions[${i - 1}]`);
    }
  });

  return {
    meta: {
      title: asString(meta.title, 'meta.title'),
      width: asNumber(meta.width, 'meta.width'),
      height: asNumber(meta.height, 'meta.height'),
      fps,
      durationSeconds,
      leadFrames,
      timingSource: asString(meta.timingSource, 'meta.timingSource'),
    },
    scenes,
    captions,
  };
}

export const reel: Reel = validate(raw);

export const FPS = reel.meta.fps;
export const WIDTH = reel.meta.width;
export const HEIGHT = reel.meta.height;
export const TOTAL_FRAMES = Math.round(reel.meta.durationSeconds * FPS);
export const LEAD = reel.meta.leadFrames;
export const TIMING_SOURCE = reel.meta.timingSource;
export const captions = reel.captions;
export const reelTitle = reel.meta.title;

/**
 * Adjacent scenes overlap by `lead` frames so they crossfade instead of
 * cutting: scene N's exit window is exactly scene N+1's enter window, which
 * makes the two opacities sum to 1 throughout the transition.
 */
export const timeline: TimelineEntry[] = (() => {
  const entries: TimelineEntry[] = [];

  reel.scenes.forEach((scene, index) => {
    const start = Math.round(scene.start * FPS);
    const end = Math.round(scene.end * FPS);
    const from = Math.max(0, start - LEAD);
    const to = index === reel.scenes.length - 1 ? TOTAL_FRAMES : end;

    entries.push({
      scene,
      index,
      from,
      to,
      start,
      end,
      lead: LEAD,
      length: to - from,
    });
  });

  const finalEntry = entries[entries.length - 1];
  if (finalEntry.to !== TOTAL_FRAMES) {
    fail(`timeline ends at frame ${finalEntry.to} but the reel is ${TOTAL_FRAMES} frames`);
  }

  return entries;
})();

export const scenesAt = (frame: number): TimelineEntry[] =>
  timeline.filter((t) => frame >= t.from && frame < t.to);

/** Scene governing captions (anchor + style) at an absolute frame. */
export const sceneAt = (frame: number): TimelineEntry | null => {
  const t = frame / FPS;
  for (const entry of timeline) {
    if (t >= entry.scene.start && t < entry.scene.end) return entry;
  }
  return frame / FPS >= reel.meta.durationSeconds ? timeline[timeline.length - 1] : null;
};

export const accentOf = (scene: SceneData): string =>
  ACCENT[(scene.accent ?? 'violet') as AccentKey];

export const normalizePhases = (scene: SceneData): Phase[] => {
  if (scene.phases && scene.phases.length > 0) return scene.phases;
  if (!scene.text) fail(`scene ${scene.id} has no "text" or "phases"`);
  return [{text: scene.text, highlight: scene.highlight, strike: scene.strike, tone: 'bright'}];
};

export const cueAt = (frame: number): CaptionCue | null => {
  const t = frame / FPS;
  for (const cue of reel.captions) {
    if (t >= cue.start && t < cue.end) return cue;
  }
  return null;
};

/** Cues that should be drawn: active, plus a short tail so they roll out. */
export const cuesNear = (frame: number, tailFrames: number): CaptionCue[] => {
  const t = frame / FPS;
  return reel.captions.filter((c) => t >= c.start && t < c.end + tailFrames / FPS);
};

export const captionAnchorAt = (frame: number): CaptionAnchor =>
  sceneAt(frame)?.scene.captionAnchor ?? 'bottom';

export const captionStyleAt = (frame: number): CaptionStyle =>
  sceneAt(frame)?.scene.captionStyle ?? 'weight';
