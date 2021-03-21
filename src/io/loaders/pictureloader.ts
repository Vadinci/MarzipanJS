//TODO add support for texture-packed sprites

import { buildPicture } from "../../graphics/picture";
import { IAssetLoader } from "../assetloader";

//TODO add a cache?

export class PictureLoader implements IAssetLoader {
    name: string = "picture";
    filetypes: string[] = ["png"];

    load(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let img = new Image();

            let cleanListeners = () => {
                img.removeEventListener('load', onLoad);
                img.removeEventListener('error', onError);
            };

            let onLoad = (evt: Event) => {
                cleanListeners();
                let picture = buildPicture(img, null);
                resolve(picture);
            };

            let onError = (e: ErrorEvent) => {
                let error = new Error("error loading picture @" + path);
                reject(error);
            };

            img.addEventListener('load', onLoad);
            img.addEventListener('error', onError);

            img.src = path;
        });
    }
}