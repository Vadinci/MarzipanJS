import Dispatcher from './dispatcher';
import Marzipan from '../marzipan';
import Matrix3 from '../math/matrix3';


let _drawDebug = false;

let startTime = 0;
let previousTime = 0;
let currentTime = 0;
let runningTime = 0;

let accumulatedTime = 0;

let ticks = 0;
let frame = 0;

let fps = 60;
let spf = 1 / fps;
let mspf = 1000 / fps;

let isRunning = false;

let _scenes = [];

let tick = function () {
    let deltaTime;

    module.emit('preTick');

    currentTime = Date.now();
    deltaTime = currentTime - previousTime;
    runningTime = currentTime - startTime;

    previousTime = currentTime;

    accumulatedTime += deltaTime;

    //prevent becoming too big
    if (accumulatedTime > 200) {
        accumulatedTime = 200;
    }

    while (accumulatedTime >= mspf) {
        update(spf);
        accumulatedTime -= mspf;
    }

    draw();

    if (_drawDebug) {
        drawDebug();
    }

    module.emit('postTick');
};

let update = function (dt) {
    let ii;
    let idx;
    let data = {};

    frame++;

    data.deltaTime = dt;
    data.currentTime = currentTime;
    data.runningTime = runningTime;
    data.frame = frame;

    module.emit('preUpdate', data);

    for (let ii = 0; ii < _scenes.length; ii++) {
        _scenes[ii].update(data);
    }

    module.emit('postUpdate', data);
};

let draw = function () {
    let ii;
    let idx;
    let data = {};

    data.currentTime = currentTime;
    data.runningTime = runningTime;
    data.frame = frame;

    data.renderer = Marzipan.renderer;

    Marzipan.renderer.setTransform(Matrix3.identity());
    Marzipan.renderer.clear();

    module.emit('preDraw', data);

    for (let ii = 0; ii < _scenes.length; ii++) {
        _scenes[ii].draw(data);
    }

    module.emit('postDraw', data);
};

let drawDebug = function () {
    let ii;
    let idx;
    let data = {};

    data.currentTime = currentTime;
    data.runningTime = runningTime;
    data.frame = frame;

    data.renderer = Marzipan.renderer;

    Marzipan.renderer.setTransform(Matrix3.identity());

    module.emit('preDrawDebug', data);

    for (let ii = 0; ii < _scenes.length; ii++) {
        _scenes[ii].drawDebug(data);
    }

    module.emit('postDrawDebug', data);
};

let addScene = function (scene) {
    let idx = _scenes.indexOf(scene);
    if (idx !== -1) throw "scene already added!";
    _scenes.push(scene);
};

let removeScene = function (scene) {
    let idx = _scenes.indexOf(scene);
    if (idx === -1) throw "scene wasn't added!";
    _scenes.splice(idx, 1);
};

let getByName = function (name) {
    //TODO
};

let getByTags = function (tags) {
    //TODO
};

let loop = function () {
    tick();
    window.requestAnimationFrame(loop);
};

let init = function () {
    if (isRunning) return;
    isRunning = true;

    startTime = Date.now();
    previousTime = startTime;

    window.requestAnimationFrame(loop);
};

let module = {
    init: init,

    addScene: addScene,
    removeScene: removeScene,

    getByName: getByName,
    getByTags: getByTags,

    setDebug: onOff => _drawDebug = onOff
};

Dispatcher.make(module);

export default module;
