//TODO add touch and multitouch support
//TODO add right mouse and middle mouse support for applications that are wrapped in electron or something similar ?
//TODO when holding two keys that are bound to the same name, and releasing one, the keyReleased event will return true. Is this an issue in the engine (the user expects the keys not to be held anymore), or should the user explicitely check if no keys are down? After all, a key *was* released.
//TODO as long the mouse is not moved, all mouse events are handled at (0,0)
//TODO gamepad support
/*
 *
 */
import Engine from './engine';
import Dispatcher from './dispatcher';
import KeyNames from '../utils/keynames';
import ENSURE from '../utils/ensure';
import Screen from '../graphics/screen';


"use strict";
let initialized = false;
let keyStates = [];

//init keystate array
(function () {
	let ii;
	for (ii = 0; ii < 255; ++ii) {
		keyStates.push({
			pressed: false,
			down: false,
			released: false
		})
	}
})();

let keyBindings = {};
let dirtyKeys = [];

let mouseState = {
	pressed: false,
	down: false,
	released: false,
	moved: false,
	x: 0,
	y: 0
};

let dirtyMouse = false;

let init = function (settings) {
	if (initialized) {
		return;
	}
	ENSURE(settings);

	window.addEventListener("keydown", handleKeyDown);
	window.addEventListener("keyup", handleKeyUp);

	Screen.canvas.addEventListener('mousedown', handleMouseDown);
	Screen.canvas.addEventListener('mouseup', handleMouseUp);
	Screen.canvas.addEventListener('mousemove', handleMouseMove);

	Engine.on('postUpdate', flush);

	initialized = true;
};

//every update, the input needs to be flushed, after any code execution that might want to use input data.
//engine takes care of this atm, but I'd rather input registers itself to the engine's dispatcher
let flush = function () {
	if (dirtyKeys.length > 0) {
		for (let ii = 0; ii < dirtyKeys.length; ii++) {
			let state = keyStates[dirtyKeys[ii]];
			state.pressed = false;
			state.released = false;
		}
		dirtyKeys = [];
	}

	if (dirtyMouse) {
		mouseState.pressed = false;
		mouseState.released = false;
		mouseState.moved = false;

		dirtyMouse = false;
	}
};

//---KEYBOARD---
let handleKeyDown = function (e) {
	let key = e.keyCode ? e.keyCode : e.which;

	let state = keyStates[key];
	if (state.down === false) {
		state.pressed = true;
		state.down = true;
		dirtyKeys.push(key);

		self.emit('keyDown-' + KeyNames[key]);
		self.emit('keyDown', key);
	}
};

let handleKeyUp = function (e) {
	let key = e.keyCode ? e.keyCode : e.which;

	let state = keyStates[key];
	if (state.down === true) {
		state.released = true;
		state.down = false;
		dirtyKeys.push(key);

		self.emit('keyUp-' + KeyNames[key]);
		self.emit('keyUp', key);
	}
};

let bindKeys = function (name, keyCodes) {
	if (keyBindings[name] === undefined) {
		keyBindings[name] = [];
	}
	keyCodes = [].concat(keyCodes);
	for (let ii = 0; ii < keyCodes.length; ii++) {
		if (keyBindings[name].indexOf(keyCodes[ii]) === -1) {
			keyBindings[name].push(keyCodes[ii]);
		}
	}
};

let unbindKeys = function (name, keyCodes) {
	if (keyBindings[name] === undefined) {
		return;
	}
	keyCodes = [].concat(keyCodes);
	for (let ii = 0; ii < keyCodes.length; ii++) {
		let idx = keyBindings[name].indexOf(keyCodes[ii])
		if (idx !== -1) {
			keyBindings[name].splice(idx, 1);
		}
	}
	if (keyBindings[name].length === 0) {
		delete keyBindings[name];
	}
};

let getBoundKeys = function (keys) {
	if (typeof keys === 'string') {
		keys = keyBindings[keys];
		return (keys === undefined) ? [] : keys;
	} else if (keys === -1) {
		//'any' key
		let allKeys = [];
		for (let ii = 0; ii < 255; ii++) {
			allKeys.push(ii);
		}
		return allKeys;
	}
	return [].concat(keys);
};

let keyPressed = function (keys) {
	keys = getBoundKeys(keys);
	for (let ii = 0; ii < keys.length; ii++) {
		if (keyStates[keys[ii]].pressed) {
			return true;
		}
	}
	return false;
};


let keyDown = function (keys) {
	keys = getBoundKeys(keys);
	for (let ii = 0; ii < keys.length; ii++) {
		if (keyStates[keys[ii]].down) {
			return true;
		}
	}
	return false;
};

let keyReleased = function (keys) {
	keys = getBoundKeys(keys);
	for (let ii = 0; ii < keys.length; ii++) {
		if (keyStates[keys[ii]].released) {
			return true;
		}
	}
	return false;
};
//----------


//---MOUSE---
let handleMouseDown = function (e) {
	if (mouseState.down === false) {
		mouseState.pressed = true;
		mouseState.down = true;
		dirtyMouse = true;
	}
	let data = {
		position: { x: mouseState.x, y: mouseState.y }
	}
	self.emit('mouseDown', data);
};

let handleMouseUp = function (e) {
	if (mouseState.down === true) {
		mouseState.released = true;
		mouseState.down = false;
		dirtyMouse = true;
	}
	let data = {
		position: { x: mouseState.x, y: mouseState.y }
	}
	self.emit('mouseUp', data);
};

let handleMouseMove = function (e) {
	let oldPos = { x: mouseState.x, y: mouseState.y };

	if (e.offsetX) {
		mouseState.x = e.offsetX;
		mouseState.y = e.offsetY;
	} else if (e.layerX) {
		mouseState.x = e.layerX;
		mouseState.y = e.layerY;
	}

	mouseState.moved = true;
	dirtyMouse = true;

	let data = {
		position: { x: mouseState.x, y: mouseState.y },
		oldPosition: oldPos
	}
	self.emit('mouseMove', data);
};

let mousePressed = function () {
	return mouseState.pressed;
};

let mouseDown = function () {
	return mouseState.down;
};

let mouseReleased = function () {
	return mouseState.released;
};

let mouseMoved = function () {
	return mouseState.moved;
};

let getMouseX = function () {
	return mouseState.x;
};

let getMouseY = function () {
	return mouseState.y;
};
//----------

//public interface
let self = {
	init: init,

	flush: flush,

	bindKeys: bindKeys,
	unbindKeys: unbindKeys,

	keyPressed: keyPressed,
	keyDown: keyDown,
	keyReleased: keyReleased,

	mousePressed: mousePressed,
	mouseDown: mouseDown,
	mouseReleased: mouseReleased,
	mouseMoved: mouseMoved,
	getMouseX: getMouseX,
	getMouseY: getMouseY
};

Dispatcher.make(self);

Object.defineProperty(self, "mouseX", {
	get: function () { return mouseState.x; },
	set: function (val) { }
});

Object.defineProperty(self, "mouseY", {
	get: function () { return mouseState.y; },
	set: function (val) { }
});

export default self;