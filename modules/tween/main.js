export { default as Tween } from './tween';

//this way all the exports from ease get imported and bundled as 1 object, which is then exported again
import * as Ease from './ease';
export { Ease };