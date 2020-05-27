import AssetLoader from '../assetloader';
import PlainLoader from './plainloader';

//TODO various loaders use a plainloader internally. Can they be shared, or use the one in assets itself somehow?
const PLAIN_LOADER = new PlainLoader();

let JsonLoader = function () {
    return new AssetLoader({
        name: 'json',
        filetypes: ['json'],
        load: function (path) {
            return new Promise((resolve, reject) => {
                PLAIN_LOADER.load(path)
                    .then(data => {
                        let jsonData = JSON.parse(data);
                        resolve(jsonData);
                    })
                    .catch(e => reject(e));
            });
        }
    });
};

export default JsonLoader;