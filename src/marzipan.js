import ModuleManager from './modulemanager';

import Engine from './core/engine';
import Assets from './core/assets';
import Input from './core/input';

import Screen from './graphics/screen';
import WebRenderer from './graphics/web/webrenderer';
import GLRenderer from './graphics/gl/glrenderer';


//default asset loaders
import YamlLoader from './io/loaders/yamlloader';
import PlainLoader from './io/loaders/plainloader';
import JsonLoader from './io/loaders/jsonloader';
import PictureLoader from './io/loaders/pictureloader';
import AudioLoader from './io/loaders/audioloader';


let renderer;

let init = function (settings) {
    //init asssets and loaders
    Assets.init(settings.assets || {});
    Assets.addLoader(new PlainLoader());
    Assets.addLoader(new YamlLoader());
    Assets.addLoader(new JsonLoader());
    Assets.addLoader(new PictureLoader());
    Assets.addLoader(new AudioLoader());

    //init graphics (renderer)
    Screen.init(settings.screen || {});
    renderer = new GLRenderer({
        screen: Screen
    });

    Input.init(settings.input || {});

    Engine.init(settings.engine || {});
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
    },
    renderer: {
        get: () => renderer
    },
    input: {
        get: () => Input
    }
});

export default Marzipan;