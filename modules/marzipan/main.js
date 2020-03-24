import ModuleManager from './modulemanager';

import Engine from './core/engine';
import Assets from './core/assets';

import Math from './math';

//default asset loaders
import YamlLoader from './io/loaders/yaml';
import PlainLoader from './io/loaders/plain';
import JsonLoader from './io/loaders/json';


let init = function (settings) {
    Engine.init(settings.engine || {});

    Assets.init(settings.assets || {});
    Assets.addLoader(new PlainLoader());
    Assets.addLoader(new YamlLoader());
    Assets.addLoader(new JsonLoader());
};

let Marzipan = {
    init,

    add: Engine.add,
    remove: Engine.remove,

    addModule: ModuleManager.addModule,
    getModule: ModuleManager.getModule
};

Object.defineProperties(Marzipan, {
    engine: {
        get: () => Engine
    },
    assets: {
        get: () => Assets
    }
});

//#region exports

export { default as Entity } from './core/entity';
export { default as Dispatcher } from './core/dispatcher';

export { default as AssetLoader } from './io/assetloader';

export {Math as Math};

export { Marzipan as Marzipan };

//#endregion