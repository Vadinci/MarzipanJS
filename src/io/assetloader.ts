export interface IAssetLoader {
    readonly name: string;
    readonly filetypes: string[];
    load(path: string): Promise<any>;
};