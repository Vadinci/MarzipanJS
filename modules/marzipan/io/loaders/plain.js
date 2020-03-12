import AssetLoader from '../assetloader';

let PlainLoader = function () {
    return new AssetLoader({
        name: 'plain',
        filetypes: ['txt'],
        load: function (path) {
            return new Promise((resolve, reject) => {

                let xhr = new window.XMLHttpRequest();
                if (xhr.overrideMimeType) {
                    xhr.overrideMimeType('text/plain');
                }

                xhr.onerror = e => reject('Error: loading file ' + path + ' - ' + e);
                xhr.ontimeout = e => reject('Timeout: loading file ' + path);

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if ((xhr.status === 304) || (xhr.status === 200) || ((xhr.status === 0) && xhr.responseText)) {
                            resolve(xhr.responseText);
                        } else {
                            reject('Error: State ' + xhr.readyState + ' ' + path);
                        }
                    }
                };

                //trigger the file load
                xhr.open('GET', path, true);
                xhr.send(null);
            });
        }
    });
};

export default PlainLoader;