let _modules = {};

let addModule = function (key, mod) {
    if (_modules[key]) {
        throw "module with key " + key + " is already defined!";
    }
    _modules[key] = mod;
};

let getModule = function (key) {
    if (!_modules[key]) {
        throw "module with key " + key + " is not defined!";
    }
    return _modules[key];
};


let ModuleManager = {
    addModule,
    getModule
};

export default ModuleManager;