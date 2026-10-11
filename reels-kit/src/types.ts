export type Palette = {
  background: string;
  panel: string;
  accent: string;
  secondary: string;
  text: string;
  muted: string;
};

/** One of the three storyboard projects. */
export type Project = {
  name: string;
  position: string;
  bank: string;
  port: number;
  palette: Palette;
  fontFamily?: string;
};

export type SceneType =
  | 'hook'
  | 'graph'
  | 'timeline'
  | 'browser'
  | 'phone'
  | 'compare'
  | 'code'
  | 'counter'
  | 'diagram'
  | 'checklist'
  | 'payoff';

export type SceneVisual = {
  /** Small mono label above the headline. */
  label?: string;
  /** Ordered list used by checklist / timeline / diagram scenes. */
  items?: string[];
  /** compare scenes: the two sides. */
  a?: string;
  b?: string;
  /** counter scenes. */
  from?: number;
  to?: number;
  prefix?: string;
  suffix?: string;
  /** code scenes. */
  file?: string;
  code?: string[];
  /** which code lines are highlighted (0-based). */
  highlight?: number[];
  /** graph scenes: retention curve with drop markers, x in 0..100. */
  drops?: number[];
  /** short supporting line rendered under the headline. */
  note?: string;
  /** optional supplied image inside a device/browser frame. */
  asset?: string | null;
};

export type Scene = {
  id: string;
  start: number;
  end: number;
  type: SceneType;
  text: string;
  narration: string;
  concept?: string;
  camera?: {fromScale: number; toScale: number; fromX: number; toX: number};
  visual?: SceneVisual;
};

/** Word-synced caption chunk. Times are seconds inside the reel. */
export type Caption = {
  text: string;
  start: number;
  end: number;
  emphasis?: string;
};

export type Reel = {
  id: string;
  title: string;
  bank: string;
  format: string;
  durationSeconds: number;
  productionReady: boolean;
  audio: string | null;
  timingSource: string;
  scenes: Scene[];
  captions: Caption[];
};
