import { IAssetLoader } from "../io/assetloader";

export class Assets {
    private _loaders: { [key: string]: IAssetLoader } = {};
    private _filetypes: { [key: string]: string } = {};

    private _assets: { [key: string]: any } = {};

    public addLoader(loader: IAssetLoader): void {
        this._loaders[loader.name] = loader;
        for (let ii = 0; ii < loader.filetypes.length; ii++) {
            let ft = loader.filetypes[ii];
            this._filetypes[ft] = loader.name;
        }

        this._assets[loader.name] = this._assets[loader.name] || {};
    };

    //TODO make this a promise as well if we're going there anyway (rather than providing a callback)?
    public load(path: string, name: string, onComplete: (asset: any) => void): void {
        let split = path.split('.');
        let extension = split.pop();
        if (!extension) {
            console.warn(`file ${path} has no file extension!`);
            return;
        }

        name = name || split.join('.');

        let assetType = this._filetypes[extension];
        if (!assetType) {
            console.warn(`no loader provided for file with extension ${extension} - ${path}`);
            return;
        }

        let loader = this._loaders[assetType];
        loader.load(path)
            .then(asset => {
                this._assets[assetType][name] = asset;
                onComplete && onComplete(asset);
            }).catch(e => {
                console.error(e);
            });
    };

    //FIXME: I'm not to happy with having to provide a type here. Can't we auto generate getters for each loader maybe?
    public get<T>(type: string, name: string): T | null {
        let asset = this._assets[type][name];
        //TODO type checking
        return this._assets[type][name] as T;
    };

    public get loaders(): IAssetLoader[] {
        let result: IAssetLoader[] = [];
        for (let key in this._loaders) {
            result.push(this._loaders[key]);
        }
        return result;
    };
};