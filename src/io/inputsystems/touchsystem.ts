/**
 * Touch input system. While this system treats the mouse as an input, it only treats it as if it were a touch. That means:
 * 	- no mouse position while the mouse isn't pressed
 *  - no mouse buttons besides the left mouse
 */

import Engine from '../../core/engine';
import Dispatcher from '../../core/dispatcher';
import Vector2 from '../../math/vector2';
import Marzipan from '../../marzipan';

const MOUSE_ID = 'mouse';	//unique 'touch' id for the mouse
const MOUSE_DOWN = 1;
const MOUSE_UP = 0;

let Touch = function (id, x, y) {
	this.position = new Vector2(x, y);
	this.start = this.position.clone();
	this.id = id;

	this.startTime = Date.now();
};

let TouchSystem = function () {
	let _touches = {};

	let _mouseState = MOUSE_UP;
	let _mousePos = { x: 0, y: 0 };

	let _canvasScale = { x: 1, y: 1 };

	let init = function (canvas) {
		Engine.on('postUpdate', _flush);

		canvas.addEventListener('touchstart', _onTouchStart);
		canvas.addEventListener('touchmove', _onTouchMove);
		canvas.addEventListener('touchend', _onTouchEnd);

		canvas.addEventListener('mousedown', _onMouseDown);
		canvas.addEventListener('mousemove', _onMouseMove);
		canvas.addEventListener('mouseup', _onMouseUp);

		Marzipan.screen.on('resize', _updateCanvasSize);
		_updateCanvasSize();
	};

	//every update, the input needs to be flushed, after any code execution that might want to use input data.
	let _flush = function () {

	};

	/** Core */
	let _createTouch = function (id, x, y) {
		
		if (_touches[id]) {
			console.warn("touch with given id already exists!");
			return;
		}

		x /= _canvasScale.x;
		y /= _canvasScale.y;

		let touch = new Touch(id, x, y);
		_touches[id] = touch;

		system.emit('start', touch);
	};

	let _updateTouch = function (id, x, y) {
		if (!_touches[id]) {
			console.warn("touch with given id doesn't exist");
			return;
		}

		x /= _canvasScale.x;
		y /= _canvasScale.y;

		let touch = _touches[id];
		touch.position.x = x;
		touch.position.y = y;

		system.emit('move', touch);
	};

	let _removeTouch = function (id) {
		if (!_touches[id]) {
			console.warn("touch with given id doesn't exist");
			return;
		}

		let touch = _touches[id];

		_touches[id] = undefined;
		system.emit('end', touch);
	};

	/** Event Handlers */
	let _onTouchStart = function (evt) {
		evt.preventDefault();

		for (let ii = 0; ii < evt.changedTouches.length; ii++) {
			let touch = evt.changedTouches[ii];
			_createTouch(touch.identifier, touch.pageX, touch.pageY);
		}
	};

	let _onTouchMove = function (evt) {
		evt.preventDefault();

		for (let ii = 0; ii < evt.changedTouches.length; ii++) {
			let touch = evt.changedTouches[ii];
			_updateTouch(touch.identifier, touch.pageX, touch.pageY);
		}
	};

	let _onTouchEnd = function (evt) {
		evt.preventDefault();

		for (let ii = 0; ii < evt.changedTouches.length; ii++) {
			let touch = evt.changedTouches[ii];
			_removeTouch(touch.identifier);
		}
	};

	let _onMouseDown = function (evt) {
		evt.preventDefault();

		_mouseState = MOUSE_DOWN;

		_createTouch(MOUSE_ID, _mousePos.x, _mousePos.y);
	};

	let _onMouseMove = function (evt) {
		evt.preventDefault();

		if (evt.offsetX) {
			_mousePos.x = evt.offsetX;
			_mousePos.y = evt.offsetY;
		} else if (evt.layerX) {
			_mousePos.x = evt.layerX;
			_mousePos.y = evt.layerY;
		}

		if (_mouseState === MOUSE_UP) return;

		_updateTouch(MOUSE_ID, _mousePos.x, _mousePos.y);
	};

	let _onMouseUp = function (evt) {
		evt.preventDefault();

		_mouseState = MOUSE_UP;

		_removeTouch(MOUSE_ID);

	};

	let _updateCanvasSize = function(){
		let screen = Marzipan.screen;

		_canvasScale.x = screen.screenWidth / screen.contentWidth;
		_canvasScale.y = screen.screenHeight / screen.contentHeight;
	};

	/** Systems */
	let system = {
		init
	};

	Object.defineProperties(system, {
		key: { get: () => 'touch' }
	});

	Dispatcher.make(system);

	return system;
};

export default TouchSystem;