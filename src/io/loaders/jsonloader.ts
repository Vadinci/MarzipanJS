import { IAssetLoader } from "../assetloader";
import { PlainLoader } from "./plainloader";

export class JsonLoader implements IAssetLoader {
    public readonly name: string = "json";
    public readonly filetypes: string[] = ["json"];

    private _plainLoader: PlainLoader;

    constructor() {
        this._plainLoader = new PlainLoader();
    }

    load(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._plainLoader.load(path)
                .then(data => {
                    let jsonData = JSON.parse(data);
                    resolve(jsonData);
                })
                .catch(e => reject(e));
        });
    }

}