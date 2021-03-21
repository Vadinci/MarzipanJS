import { Howl } from 'howler';
import { IAssetLoader } from '../assetloader';

export class AudioLoader implements IAssetLoader {
	public readonly name: string = "audio";
	public readonly filetypes: string[] = ["webm", "mp3", "wav"];

	public load(path: string): Promise<any> {
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
}