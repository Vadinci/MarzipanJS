import AssetLoader from '../assetloader';
import PlainLoader from './plainloader';

// let JsonLoader = function () {
let JsonLoader = new AssetLoader({
    name: 'json',
    filetypes: ['json'],
    load: function (path) {
        return new Promise((resolve, reject) => {
            PlainLoader.load(path)
                .then(data => {
                    let jsonData = JSON.parse(data);
                    resolve(jsonData);
                })
                .catch(e => reject(e));
        });
    }
});
// };

export default JsonLoader;