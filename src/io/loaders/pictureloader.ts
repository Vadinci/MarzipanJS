//TODO add support for texture-packed sprites

//TODO add a cache?

import AssetLoader from '../assetloader';
import Picture from '../../graphics/picture';

// let PictureLoader = function () {
let PictureLoader = new AssetLoader({
    name: 'picture',
    filetypes: ['png'],
    load: function (path) {
        return new Promise((resolve, reject) => {
            let img = new Image();

            let cleanListeners = () => {
                img.removeEventListener('load', onLoad);
                img.removeEventListener('error', onError);
            };

            let onLoad = (evt: Event) => {
                cleanListeners();
                let picture = Picture(img, null);
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
});
// };

export default PictureLoader;