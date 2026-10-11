export type Channel = {
  name: string;
  position: string;
  palette: {background: string; panel: string; accent: string; secondary: string; text: string; muted: string};
  visualStyle: string;
};
export type EditorialSceneSelection = {
  /** Only this exact opt-in identifier switches a scene to pastel editorial graphics. */
  template: 'editorial-motion';
  mode: 'illustrated-explainer' | 'saas-ui' | 'product-comparison';
  layout?: 'full' | 'upper';
  headline?: string;
  subheadline?: string;
  emphasis?: string;
  items?: string[];
  /** Optional lower-screen silent presenter video; reel.audio remains the narration track. */
  presenterAsset?: string;
};

export type ReelScene = {
  /** Completely optional; existing scenes, channel palettes and rendering remain unchanged. */
  editorial?: EditorialSceneSelection;
  id: string;
  start: number;
  end: number;
  type: string;
  text: string;
  narration: string;
  concept: string;
  asset: string | null;
  assetKind?: 'image' | 'video';
  transition: string;
  camera?: {fromScale: number; toScale: number; fromX: number; toX: number};
  captionChunks?: string[];
  captionTimings?: {text: string; start: number; end: number}[];
  presentationNarration?: string;
  presentationText?: string;
};
export type Reel = {
  id: string;
  title: string;
  format: string;
  durationSeconds: number;
  productionReady: boolean;
  script: string;
  audio: string | null;
  scenes: ReelScene[];
  visualStatus?: string;
  visualReady?: boolean;
};
