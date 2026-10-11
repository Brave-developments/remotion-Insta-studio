export type SceneType =
  | 'hook'
  | 'kinetic'
  | 'prompt'
  | 'browser'
  | 'app-window'
  | 'comparison'
  | 'feature-list'
  | 'diagram'
  | 'number'
  | 'outro';

export type CaptionChunk = {
  start: number;
  end: number;
  text: string;
  highlight?: string[];
};

export type Scene = {
  id: string;
  type: SceneType;
  duration: number;
  narration: string;
  headline?: string;
  subheadline?: string;
  highlight?: string;
  quote?: string;
  items?: string[];
  labels?: string[];
  captions: CaptionChunk[];
};
