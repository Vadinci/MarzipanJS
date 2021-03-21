import { IAssetLoader } from '../assetloader';

export class PlainLoader implements IAssetLoader {
    public readonly name: string = "plain";
    public readonly filetypes: string[] = ["txt"];

    public load(path: string): Promise<any> {
        return new Promise((resolve, reject) => {

            let xhr = new window.XMLHttpRequest();
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType("text/plain");
            }

            xhr.onerror = err => reject(`Error: loading file ${path} -  ${err}`);
            xhr.ontimeout = err => reject(`Timeout: loading file ${path}`);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if ((xhr.status === 304) || (xhr.status === 200) || ((xhr.status === 0) && xhr.responseText)) {
                        resolve(xhr.responseText);
                    } else {
                        reject(`Error: State ${xhr.readyState} ${path}`);
                    }
                }
            };

            //trigger the file load
            xhr.open("GET", path, true);
            xhr.send(null);
        });
    }
}