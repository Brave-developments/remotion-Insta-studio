import {SeasonCompositions} from '../../../reels-kit/src/player';
import type {Project, Reel} from '../../../reels-kit/src/types';
import project from '../project.json';
import season from '../season/reels.json';

export const Root = () => (
  <SeasonCompositions project={project as Project} reels={season.reels as Reel[]} />
);
