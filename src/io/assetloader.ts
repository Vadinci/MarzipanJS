import ENSURE from '../utils/ensure';

type AssetLoaderSettings = {
    name: string;
    filetypes: string[];
    load: (path: string) => Promise<any>;   //TODO can this any be more precise?
};

class AssetLoader {
    public name: string;
    public filetypes: string[];
    public load: (path: string) => Promise<any>;

    constructor(settings:AssetLoaderSettings){
        this.name = ENSURE(settings.name);
        this.filetypes = ENSURE(settings.filetypes);
        this.load = ENSURE(settings.load);
    };
};

export default AssetLoader;