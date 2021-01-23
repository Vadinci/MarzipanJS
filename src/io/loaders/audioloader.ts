import { Howl, Howler } from 'howler';
import AssetLoader from '../assetloader';

// let AudioLoader = function () {
let AudioLoader = new AssetLoader({
	name: 'audio',
	filetypes: ['webm', 'mp3', 'wav'],
	load: function (path) {
		//TODO how to deal with loading a file multiple times with different extensions?
		return new Promise((resolve, reject) => {
			let sound = new Howl({
				src: path,
				preload: true,
				onload: () => {
					resolve(sound);
				},
				onloaderror: (id, err) => {
					reject(err);
				}
			});
		});
	}
});
// };

export default AudioLoader;