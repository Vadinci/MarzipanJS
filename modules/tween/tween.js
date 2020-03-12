//TODO
const NOTHING = () => { };

let Tween = function (properties) {
    this._tweenFunc;
    this._time = 0;
    this._duration = 1;
    this._isPlaying;
    this._direction = 1;

    this._onStartCB = NOTHING;
    this._onUpdateCB = NOTHING;
    this._onCompleteCB = NOTHING;

    this.setUp(properties);
};

//TIMING
Tween.prototype.update = function(){
    //TODO
};

Tween.prototype.start = function(){
    //TODO
};

Tween.prototype.pause = function(){
    //TODO
};

Tween.prototype.setTime = function(){
    //TODO
};

//CALLBACKS
Tween.prototype.onStart = function(cb){
    if (!cb) cb = NOTHING;
    this._onStartCB = cb;
};

Tween.prototype.onUpdate = function(cb){
    if (!cb) cb = NOTHING;
    this._onUpdateCB = cb;
};

Tween.prototype.onComplete = function(cb){
    if (!cb) cb = NOTHING;
    this._onCompleteCB = cb;
};

export default Tween;
