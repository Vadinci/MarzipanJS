import Dispatcher from './dispatcher';



let _drawDebug = false;

let startTime = 0;
let previousTime = 0;
let currentTime = 0;
let runningTime = 0;

let accumulatedTime = 0

let ticks = 0;
let frame = 0;

let fps = 60;
let mspf = 1000 / fps;

let isRunning = false;

let canvas;

let entities = [];
let updateOrder = [];
let drawOrder = [];

let addList = [];
let removeList = [];

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
        update(1);
        accumulatedTime -= mspf;
    }

    draw(1);

    if (_drawDebug) {
        drawDebug(1);
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

    for (ii = updateOrder.length - 1; ii >= 0; --ii) {
        data.entity = updateOrder[ii];
        updateOrder[ii].update(data);
    }

    //check if any entities need to be added
    for (ii = 0; ii < addList.length; ii++) {
        entities.push(addList[ii]);
        data.entity = addList[ii];
        addList[ii].start(data);

        updateOrder.push(addList[ii]);
        drawOrder.push(addList[ii]);
    }
    addList = [];

    //check if any entities need to be removed
    for (ii = 0; ii < removeList.length; ii++) {
        data.entity = removeList[ii];
        removeList[ii].die(data);

        updateOrder.splice(updateOrder.indexOf(removeList[ii]), 1);
        drawOrder.splice(drawOrder.indexOf(removeList[ii]), 1);
        entities.splice(entities.indexOf(removeList[ii]), 1);
    }
    removeList = [];

    sortEntities()

    module.emit('postUpdate', data);
};

let draw = function (dt) {
    let ii;
    let idx;
    let data = {};

    frame++;

    data.deltaTime = dt;
    data.currentTime = currentTime;
    data.runningTime = runningTime;
    data.frame = frame;

    module.emit('preDraw', data);

    for (ii = 0; ii < drawOrder.length; ii++) {
        data.entity = drawOrder[ii];
        drawOrder[ii].draw(data);
    }

    module.emit('postDraw', data);
};

let drawDebug = function (dt) {
    let ii;
    let idx;
    let data = {};

    frame++;

    data.deltaTime = dt;
    data.currentTime = currentTime;
    data.runningTime = runningTime;
    data.frame = frame;

    module.emit('preDrawDebug', data);

    for (ii = 0; ii < drawOrder.length; ii++) {
        data.entity = drawOrder[ii];
        drawOrder[ii].drawDebug(data);
    }

    module.emit('postDrawDebug', data);
};

let addEntity = function (entity) {
    if (addList.indexOf(entity) !== -1) {
        return;
    }
    addList.push(entity);
};

let removeEntity = function (entity) {
    if (removeList.indexOf(entity) !== -1) {
        return;
    }
    removeList.push(entity);
};

let sortEntities = function () {
    //sort update order
    //TODO in place sorting
    updateOrder.sort(function (a, b) {
        return a.priority - b.priority;
    });

    //sort draw order
    //TODO in place sorting
    drawOrder.sort(function (a, b) {
        return a.z - b.z;
    });
};

let getByName = function (name) {
    let result = [];
    for (let ii = 0; ii < entities.length; ii++) {
        if (entities[ii].name === name) result.push(entities[ii]);
    }
    return result;
};

let getByTags = function (tags) {
    tags = [].concat(tags); //force to array;

    let result = [];
    for (let ii = 0; ii < entities.length; ii++) {
        if (entities[ii].hasTags(tags)) result.push(entities[ii]);
    }
    return result;
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

    add: addEntity,
    remove: removeEntity,

    getByName: getByName,
    getByTags: getByTags,

    setDebug: onOff => _drawDebug = onOff
};

Dispatcher.make(module);

export default module;
