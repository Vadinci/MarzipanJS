//TODO ENSURE is being used in multiple places. Clean way of centralizing it?
const ENSURE = val => {
    if (val === void (0)) throw "value is required!";
    return val;
};

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