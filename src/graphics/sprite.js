//TODO add pause and resume;
//TODO documentation

import Dispatcher from "../core/dispatcher";
import Vector2 from "../math/vector2";
import ENSURE from "../utils/ensure";
import Transform from "../math/transform";
import Rectangle from "../math/rectangle";

let Animation = function (settings) {
	ENSURE(settings);

	let _loop = settings.loop || false;
	let _isPlaying = false;

	let _frames = settings.frames || [0];
	let _frameDurations = [];

	let _currentFrameIdx = 0;
	let _currentFrameTime = 0;

	for (let ii = 0; ii < _frames.length; ii++) {
		let duration = 1 / 24;	//a default speed of 24 frames per second
		if (settings.fps) duration = 1 / settings.fps;
		if (settings.frameDurations && settings.frameDurations.length > ii) duration = settings.frameDurations[ii];

		_frameDurations[ii] = duration;
	}

	let start = function () {
		_isPlaying = true;

		_currentFrameTime = 0;
		_currentFrameIdx = 0;
		animation.emit('start', {});
	};

	let stop = function () {
		_isPlaying = false;
	};

	let update = function (data) {
		if (!_isPlaying) return;

		_currentFrameTime += data.deltaTime;

		while (_currentFrameTime > _frameDurations[_currentFrameIdx]) {
			_currentFrameTime -= _frameDurations[_currentFrameIdx];
			_currentFrameIdx++;

			if (_currentFrameIdx >= _frames.length) {
				animation.emit('complete', {});
				if (!_loop) {
					_currentFrameIdx = _frames.length - 1;
					_isPlaying = false;
					return;
				} else {
					_currentFrameIdx = 0;
					animation.emit('loop', {});
				}
			}
		}
	};

	let animation = {
		start,
		stop,
		update
	};
	Dispatcher.make(animation);

	Object.defineProperties(animation, {
		isAnimation: {
			get: () => true
		},
		frame: {
			get: () => _frames[_currentFrameIdx]
		}
	});

	return animation;
};

let Sprite = function (settings) {
	ENSURE(settings);
	this._picture = ENSURE(settings.picture);

	this._transform = new Transform();

	this._origin = settings.origin || new Vector2(0, 0);
	this._frame = new Rectangle(0, 0, settings.frameWidth || this._picture.width, settings.frameHeight || this._picture.height);

	this._frameIdx = 0;
	this._frameCountX = Math.floor(this._picture.width / this._frame.width);
	this._frameCountY = Math.floor(this._picture.height / this._frame.height);

	this._currentAnimation = undefined;
	this._animations = {};
};


Sprite.prototype.addAnimation = function (name, animation) {
	if (this._animations[name]) {
		//TODO throw stuff? It's not wrong to override an animation :/
	}
	if (!animation.isAnimation) {
		//presumably provided settings object rather than an animation object
		animation = new Animation(animation);
	}
	this._animations[name] = animation;
	if (!this._currentAnimation) this._currentAnimation = animation;

	return animation;
};

Sprite.prototype.play = function (name, onComplete) {
	let animation = this._animations[name];
	if (!animation) {
		console.warn('animation with name ' + name + ' does not exist!');
		return;
	}
	if (onComplete) animation.once('complete', onComplete);
	this._currentAnimation = animation;
	animation.start();

	return animation;
};

Sprite.prototype.setFrame = function (idx) {
	this._frameIdx = idx;

	let col = idx % this._frameCountX;
	let row = Math.floor(idx / this._frameCountX);

	if (row >= this._frameCountY) throw new RangeError("frame index out of range!");

	this._frame.x = this._frame.width * col;
	this._frame.y = this._frame.height * row;
};


/**
 * Component functions
 */
Sprite.prototype.added = function (data) {
	this._transform.setParent(data.entity.transform);
};

Sprite.prototype.update = function (data) {
	if (!this._currentAnimation) return;

	let oldFrameIdx = this._frameIdx;
	this._currentAnimation.update(data);
	if (this._currentAnimation.frameIdx !== oldFrameIdx) {
		setFrame(this._currentAnimation.frame);
	}
};

Sprite.prototype.draw = function (data) {
	data.renderer.setTransform(this._transform.globalMatrix);
	
	data.renderer.drawPicturePart(this._picture,
		this._frame.x, this._frame.y,
		this._frame.width, this._frame.height,
		-this._origin.x, -this._origin.y,
		this._frame.width, this._frame.height
	);
};

Object.defineProperties(Sprite.prototype, {
	frame: {
		get: function () { return this._frame; }
	},
	transform: {
		get: function () { return this._transform; }
	}
});

Sprite.Animation = Animation;

export default Sprite;