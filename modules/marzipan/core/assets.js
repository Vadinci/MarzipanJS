let _loaders = {};
let _filetypes = {};

let _assets = {};

let init = function () {
    //TODO
};

//TODO add some warnings if defining duplicate name/filetype?
let addLoader = function (loader) {
    _loaders[loader.name] = loader;
    for (let ii = 0; ii < loader.filetypes.length; ii++) {
        let ft = loader.filetypes[ii];
        _filetypes[ft] = loader.name;
    }
    _assets[loader.name] = _assets[loader.name] || {};
};

//TODO make this a promise as well if we're going there anyway?
let load = function (path, name, onComplete) {
    let split = path.split('.');
    let extension = split.pop();
    name = name || split.join('.');

    let assetType = _filetypes[extension];
    if (!assetType) {
        console.warn('no loader provided for file with extension ' + extension + ' - ' + path);
        return;
    }

    let loader = _loaders[assetType];
    loader.load(path)
        .then(asset => {
            _assets[assetType][name] = asset;
            onComplete && onComplete(asset);
        }).catch(e => {
            console.error(e);
        });
};

let get = function (type, name) {
    //TODO
    return _assets[type][name];
};

let Assets = {
    init,

    addLoader,

    load,
    get
};

Object.defineProperties(Assets, {
    loaders: {
        get: () => _loaders
    }
});

export default Assets;