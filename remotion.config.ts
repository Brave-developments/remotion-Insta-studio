import {Config} from '@remotion/cli/config';

Config.setEntryPoint('./src/index.ts');
Config.setVideoImageFormat('jpeg');
// Dark, low-contrast frames band visibly at Remotion's default JPEG quality.
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setConcurrency(null);
