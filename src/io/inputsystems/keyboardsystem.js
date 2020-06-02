import Engine from '../../core/engine';
import KeyNames from '../../utils/keynames';
import Dispatcher from '../../core/dispatcher';

let KeyboardSystem = function () {
	let _keyStates = [];
	let _dirtyKeys = [];

	let init = function (canvas) {
		//init keystate array
		(function () {
			let ii;
			for (ii = 0; ii < 255; ++ii) {
				_keyStates.push({
					pressed: false,
					down: false,
					released: false
				})
			}
		})();

		Engine.on('postUpdate', _flush);

		window.addEventListener('keydown', _handleKeyDown);
		window.addEventListener('keyup', _handleKeyUp);
	};


	//every update, the input needs to be flushed, after any code execution that might want to use input data.
	//engine takes care of this atm, but I'd rather input registers itself to the engine's dispatcher
	let _flush = function () {
		if (_dirtyKeys.length > 0) {
			for (let ii = 0; ii < _dirtyKeys.length; ii++) {
				let state = _keyStates[_dirtyKeys[ii]];
				state.pressed = false;
				state.released = false;
			}
			_dirtyKeys = [];
		}
	};


	let _handleKeyDown = function (e) {
		let key = e.keyCode ? e.keyCode : e.which;

		let state = keyStates[key];
		if (state.down === false) {
			state.pressed = true;
			state.down = true;
			dirtyKeys.push(key);

			system.emit('down-' + KeyNames[key]);
			system.emit('down', key);
		}
	};

	let _handleKeyUp = function (e) {
		let key = e.keyCode ? e.keyCode : e.which;

		let state = keyStates[key];
		if (state.down === true) {
			state.released = true;
			state.down = false;
			dirtyKeys.push(key);

			system.emit('up-' + KeyNames[key]);
			system.emit('up', key);
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


	let system = {
		init,

		bindKeys,
		unbindKeys,
		getBoundKeys,

		keyPressed,
		keyDown,
		keyReleased
	};

	Object.defineProperties(system, {
		key: { get: () => 'keyboard' }
	});

	Dispatcher.make(system);

	return system;
};

export default KeyboardSystem;