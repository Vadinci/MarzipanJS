import YAML from 'yaml-js';

import AssetLoader from '../assetloader';
import PlainLoader from './plain';

//TODO various loaders use a plainloader internally. Can they be shared, or use the one in assets itself somehow?
const PLAIN_LOADER = new PlainLoader();

let YamlLoader = function () {
    return new AssetLoader({
        name: 'yaml',
        filetypes: ['yaml'],
        load: function (path) {
            return new Promise((resolve, reject) => {
                PLAIN_LOADER.load(path)
                    .then(data => {
                        let yamlData = YAML.load(data);
                        resolve(yamlData);
                    })
                    .catch(e => reject(e));
            });
        }
    });
};

export default YamlLoader;