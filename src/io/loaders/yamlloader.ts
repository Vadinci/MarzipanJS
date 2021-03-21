import * as jsyaml from 'js-yaml';

import { IAssetLoader } from '../assetloader';
import { PlainLoader } from './plainloader';

export class YamlLoader implements IAssetLoader {
    public readonly name: string = "yaml";
    public readonly filetypes: string[] = ["yaml"];

    private _plainLoader: PlainLoader;

    constructor() {
        this._plainLoader = new PlainLoader();
    }

    public load(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._plainLoader.load(path)
                .then(data => {
                    let yamlData = jsyaml.load(data);
                    resolve(yamlData);
                })
                .catch(e => reject(e));
        });
    }
}