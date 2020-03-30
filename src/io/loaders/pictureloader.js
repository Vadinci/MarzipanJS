//TODO add support for texture-packed sprites

//TODO add a cache?

import AssetLoader from '../assetloader';
import Picture from '../../graphics/picture';

let PictureLoader = function () {
    return new AssetLoader({
        name: 'picture',
        filetypes: ['png'],
        load: function (path) {
            return new Promise((resolve, reject) => {
                let img = new Image();

                let cleanListeners = () => {
                    img.removeEventListener('load', onLoad);
                };

                let onLoad = evt => {
                    cleanListeners();
                    let picture = new Picture(img);
                    resolve(picture);
                };

                let onError = err => {
                    reject(err);
                };

                img.addEventListener('load', onLoad);
                img.addEventListener('error', onError);

                img.src = path;
            });
        }
    });
};

export default PictureLoader;