import YAML from 'yaml-js';

import AssetLoader from '../assetloader';
import PlainLoader from './plainloader';


// let YamlLoader = function () {
let YamlLoader = new AssetLoader({
    name: 'yaml',
    filetypes: ['yaml'],
    load: function (path) {
        return new Promise((resolve, reject) => {
            PlainLoader.load(path)
                .then(data => {
                    let yamlData = YAML.load(data);
                    resolve(yamlData);
                })
                .catch(e => reject(e));
        });
    }
});
// };

export default YamlLoader;