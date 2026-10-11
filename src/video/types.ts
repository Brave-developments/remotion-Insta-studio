import type {AccentKey} from './theme';

export const SCENE_TYPES = [
  'particle',
  'chat',
  'network',
  'diagram',
  'browser',
  'taskflow',
  'kinetic',
  'device',
  'race',
  'comparison',
  'code',
  'apps',
  'outro',
] as const;

export type SceneType = (typeof SCENE_TYPES)[number];

export type Tone = 'bright' | 'muted' | 'faint';
export type EnterDir = 'up' | 'down' | 'left' | 'right' | 'scale';

/** Where captions sit for a scene — deliberately not one fixed position. */
export type CaptionAnchor = 'bottom' | 'top' | 'top-left' | 'bottom-left';

/** How the current spoken word is emphasised (varies per scene). */
export type CaptionStyle = 'box' | 'underline' | 'weight' | 'tint';

export type Phase = {
  text: string;
  highlight?: string;
  strike?: string;
  tone?: Tone;
};

export type FeatureItem = {
  label: string;
  icon: string;
  span?: boolean;
  detail?: string;
};

/** Every scene shares these. */
export type BaseScene = {
  id: string;
  /** Seconds — authoritative, derived from the narration. */
  start: number;
  end: number;
  type: SceneType;
  /** The narration line this scene covers. */
  narration: string;
  /** What the viewer sees, in one sentence. */
  concept: string;
  /** Cutout names from public/assets/cutouts. */
  assets?: string[];
  accent?: AccentKey;
  enter?: EnterDir;
  align?: 'center' | 'left';
  captionAnchor?: CaptionAnchor;
  captionStyle?: CaptionStyle;
  /** Conceptual hand-off to the next scene. */
  transitionOut?: string;
  // typography support
  text?: string;
  highlight?: string;
  strike?: string;
  tone?: Tone;
  phases?: Phase[];
  kicker?: string;
};

export type ParticleSceneData = BaseScene & {
  type: 'particle';
  word?: string;
};

export type ChatSceneData = BaseScene & {
  type: 'chat';
  title?: string;
  messages?: {from: 'user' | 'bot'; text: string}[];
  verdict?: string;
};

export type NetworkSceneData = BaseScene & {
  type: 'network';
  variant?: 'network' | 'hub';
  center?: string;
  nodes?: FeatureItem[];
  caption?: string;
  title?: string;
};

export type DiagramSceneData = BaseScene & {
  type: 'diagram';
  queued?: string[];
  steps?: FeatureItem[];
  title?: string;
};

export type BrowserSceneData = BaseScene & {
  type: 'browser';
  url?: string;
  prompt: string;
  steps?: string[];
  results?: {name: string; spec: string; price: string; score: number; best?: boolean}[];
};

export type TaskFlowSceneData = BaseScene & {
  type: 'taskflow';
  tabs?: string[];
  tasks?: FeatureItem[];
  compare?: {name: string; price: number; spec: string; best?: boolean}[];
};

export type KineticSceneData = BaseScene & {
  type: 'kinetic';
  text: string;
  highlight?: string;
};

export type DeviceSceneData = BaseScene & {
  type: 'device';
  app?: string;
  badge?: string;
  ring?: {label: string; value: number};
  rows?: string[];
  metrics?: {label: string; value: string}[];
};

export type RaceSceneData = BaseScene & {
  type: 'race';
  runners?: {label: string; pct: number}[];
  goal?: string;
};

export type ComparisonSceneData = BaseScene & {
  type: 'comparison';
  left?: {title: string; items: string[]};
  right?: {title: string; steps: FeatureItem[]};
  verdict?: string;
};

export type CodeSceneData = BaseScene & {
  type: 'code';
  file?: string;
  lines?: {t: string; k?: string}[];
  capabilities?: FeatureItem[];
};

export type AppsSceneData = BaseScene & {
  type: 'apps';
  tiles?: string[];
  from?: number;
  to?: number;
  command: string;
  labels?: [string, string];
};

export type OutroSceneData = BaseScene & {
  type: 'outro';
  phases?: Phase[];
};

export type SceneData =
  | ParticleSceneData
  | ChatSceneData
  | NetworkSceneData
  | DiagramSceneData
  | BrowserSceneData
  | TaskFlowSceneData
  | KineticSceneData
  | DeviceSceneData
  | RaceSceneData
  | ComparisonSceneData
  | CodeSceneData
  | AppsSceneData
  | OutroSceneData;

export type CaptionWord = {text: string; hl: boolean};

export type CaptionCue = {
  start: number;
  end: number;
  words: CaptionWord[];
};

export type ReelMeta = {
  title: string;
  width: number;
  height: number;
  fps: number;
  durationSeconds: number;
  leadFrames: number;
  /** Honest label for where timings came from. */
  timingSource: string;
};

export type Reel = {
  meta: ReelMeta;
  scenes: SceneData[];
  captions: CaptionCue[];
};

export type TimelineEntry = {
  scene: SceneData;
  index: number;
  /** First frame drawn (start - lead, clamped at 0). */
  from: number;
  /** Exclusive last frame drawn. */
  to: number;
  /** Nominal start / end frames. */
  start: number;
  end: number;
  lead: number;
  length: number;
};

export type SceneProps = {entry: TimelineEntry};
