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
let _addList = [];
let _removeList = [];

let tick = function () {
    let deltaTime;

    module.emit('preTick');

    currentTime = Date.now();
    deltaTime = currentTime - previousTime;
    runningTime = currentTime - startTime;

    previousTime = currentTime;

    accumulatedTime += deltaTime;

    ticks++;

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
    frame++;

    let gameData = _getGameData();
    gameData.deltaTime = dt;

    module.emit('preUpdate', gameData);

    //we update in reverse order. This way scenes on 'top' get updated first and have control over the scenes below them
    for (let ii = _scenes.length - 1; ii >= 0; ii--) {
        _scenes[ii].update(gameData);
    }

    _handleAddList();
    _handleRemoveList();

    module.emit('postUpdate', gameData);
};

let draw = function () {
    let gameData = _getGameData();
    gameData.renderer = Marzipan.renderer;

    Marzipan.renderer.setTransform(Matrix3.identity());
    Marzipan.renderer.clear();

    module.emit('preDraw', gameData);

    for (let ii = 0; ii < _scenes.length; ii++) {
        _scenes[ii].draw(gameData);
    }

    module.emit('postDraw', gameData);
};

let drawDebug = function () {
    let gameData = _getGameData();
    gameData.renderer = Marzipan.renderer;

    Marzipan.renderer.setTransform(Matrix3.identity());

    module.emit('preDrawDebug', gameData);

    for (let ii = 0; ii < _scenes.length; ii++) {
        _scenes[ii].drawDebug(gameData);
    }

    module.emit('postDrawDebug', gameData);
};

let addScene = function (scene) {
    let idx = _scenes.indexOf(scene);
    if (idx !== -1) throw new Error("scene already added!");

    _addList.push(scene);
};

let removeScene = function (scene) {
    let idx = _scenes.indexOf(scene);
    if (idx === -1) throw new Error("scene wasn't added!");
    _removeList.push(scene);
};

let _getGameData = function () {
    let gameData = {};

    gameData.currentTime = currentTime;
    gameData.runningTime = runningTime;
    gameData.frame = frame;
    gameData.ticks = ticks;

    return gameData;
};

let _handleAddList = function (gameData) {
    for (let ii = 0; ii < _addList.length; ii++) {
        _scenes.push(_addList[ii]);
        _addList[ii].start(_getGameData());
    }

    if (_addList.length !== 0) {
        _scenes.sort((a, b) => {
            return a.layer - b.layer;
        });
    }

    _addList = [];
};

let _handleRemoveList = function (gameData) {
    for (let ii = 0; ii < _removeList.length; ii++) {
        _removeList[ii].die(_getGameData());
        _scenes.splice(_scenes.indexOf(_removeList[ii]), 1);
    }
    _removeList = [];
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
