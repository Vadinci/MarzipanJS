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
	let _picture = ENSURE(settings.picture);

	let _transform = new Transform();

	let _origin = settings.origin || new Vector2(0, 0);
	let _frame = new Rectangle(0, 0, _picture.width, _picture.height);

	let _frameIdx = 0;
	let _frameCountX = 1;
	let _frameCountY = 1;

	let _currentAnimation = undefined;
	let _animations = {};


	let addAnimation = function (name, animation) {
		if (_animations[name]) {
			//TODO throw stuff? It's not wrong to override an animation :/
		}
		if (!animation.isAnimation) {
			//presumably provided settings object rather than an animation object
			animation = new Animation(animation);
		}
		_animations[name] = animation;
		if (!_currentAnimation) _currentAnimation = animation;

		return animation;
	};

	let play = function (name, onComplete) {
		let animation = _animations[name];
		if (!animation) {
			console.warn('animation with name ' + name + ' does not exist!');
			return;
		}
		if (onComplete) animation.once('complete', onComplete);
		_currentAnimation = animation;
		animation.start();

		return animation;
	};

	let setFrame = function (idx) {
		_frameIdx = idx;

		let col = idx % _frameCountX;
		let row = Math.floor(idx / _frameCountX);

		if (row >= _frameCountY) throw "invalid frame index!";

		_frame.x = _frame.width * col;
		_frame.y = _frame.height * row;
	};



	let added = function (data) {
		_transform.setParent(data.entity.transform);
	}

	let update = function (data) {
		if (!_currentAnimation) return;

		let oldFrameIdx = _frameIdx;
		_currentAnimation.update(data);
		if (_currentAnimation.frameIdx !== oldFrameIdx) {
			setFrame(_currentAnimation.frame);
		}
	};

	let draw = function (data) {
		data.renderer.setTransform(_transform.globalMatrix);
		data.renderer.drawPicturePart(_picture, _frame.x, _frame.y, _frame.width, _frame.height, -_origin.x, -_origin.y);
	};

	let sprite = {
		setFrame,

		added,
		update,
		draw
	};

	Object.defineProperties(sprite, {
		frame: {
			get: () => _frame
		},
		transform : {
			get : () => _transform
		}
	});

	return sprite;
};

Sprite.Animation = Animation;

export default Sprite;