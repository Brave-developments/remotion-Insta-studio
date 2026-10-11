import {Composition} from 'remotion';
import channel from '../channel.json';
import week from '../week-1/remotion-week.json';
import {BrandPreview, PlannedReel} from '../../../studio-kit/src/Engine';
import {EditorialMotionPreview} from '../../../studio-kit/src/EditorialMotion';
import type {Channel, Reel} from '../../../studio-kit/src/types';

export const Root = () => <>
  <Composition id="EditorialMotionPreview" component={EditorialMotionPreview} durationInFrames={360} fps={30} width={1080} height={1920}/>
  <Composition id="ChannelPreview" component={BrandPreview} durationInFrames={360} fps={30} width={1080} height={1920} defaultProps={{channel: channel as Channel}} />
  {week.reels.map(reel => <Composition key={reel.id} id={reel.id} component={PlannedReel} calculateMetadata={({props})=>({durationInFrames:Math.round(props.reel.durationSeconds*30)})} durationInFrames={Math.round(reel.durationSeconds*30)} fps={30} width={1080} height={1920} defaultProps={{channel: channel as Channel, reel: reel as Reel}} />)}
</>;
