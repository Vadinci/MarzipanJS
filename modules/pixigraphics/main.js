import * as PIXI from 'pixi.js';
import { Marzipan } from '#Marzipan';

let _app;

let init = function (settings) {
    settings = settings || {};
    settings.width = settings.width || 640;
    settings.height = settings.height || 640;

    let app = new PIXI.Application(settings);
    document.body.appendChild(app.view);

    Marzipan.engine.on('postDraw', () => {
        console.log('tick from pixi!')
    })
};

let Graphics = {
    init
};

export { Graphics as Graphics };