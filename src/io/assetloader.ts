import ENSURE from '../utils/ensure';

let AssetLoader = function (settings) {
    ENSURE(settings);

    let loader = {
        name: ENSURE(settings.name),
        filetypes : ENSURE(settings.filetypes),
        load : ENSURE(settings.load)
    };
    return loader;
};

export default AssetLoader;