import {Composition} from 'remotion';
import {SeasonCompositions} from '../../../reels-kit/src/player';
import {EditorialMotionPreview} from '../../../studio-kit/src/EditorialMotion';
import type {Project, Reel} from '../../../reels-kit/src/types';
import project from '../project.json';
import season from '../season/reels.json';

export const Root = () => (
  <>
    <SeasonCompositions project={project as Project} reels={season.reels as Reel[]} />
    <Composition id="EditorialMotionPreview" component={EditorialMotionPreview} durationInFrames={360} fps={30} width={1080} height={1920}/>
  </>
);
