import { Engine } from '../../core/engine';
import { KeyNames } from '../../utils/keynames';
import { Dispatcher } from '../../core/dispatcher';

export type KeyState = {
	pressed: boolean;
	down: boolean;
	released: boolean;
};

export class Keyboard extends Dispatcher {
	private _keyStates: KeyState[] = [];
	private _dirtyKeys: number[] = [];
	private _keyBindings: { [key: string]: number[] } = {};

	public init(engine: Engine): void {
		//init keystate array
		(() => {
			let ii;
			for (ii = 0; ii < 255; ++ii) {
				this._keyStates.push({
					pressed: false,
					down: false,
					released: false
				})
			}
		})();

		engine.on('postUpdate', this._flush.bind(this));

		window.addEventListener('keydown', this._handleKeyDown.bind(this));
		window.addEventListener('keyup', this._handleKeyUp.bind(this));
	};

	//every update, the input needs to be flushed, after any code execution that might want to use input data.
	private _flush(): void {
		if (this._dirtyKeys.length > 0) {
			for (let ii = 0; ii < this._dirtyKeys.length; ii++) {
				let state = this._keyStates[this._dirtyKeys[ii]];
				state.pressed = false;
				state.released = false;
			}
			this._dirtyKeys = [];
		}
	};



	private _handleKeyDown(e: KeyboardEvent) {
		//technically keyCode is deprecated but the alternative is using e.code which returns a string that can
		//be different depending on the browser. We'll hold on to using keyCode as long as feasible
		let key = e.keyCode ? e.keyCode : e.which;

		let state = this._keyStates[key];
		if (state.down === false) {
			state.pressed = true;
			state.down = true;
			this._dirtyKeys.push(key);

			this.emit('down-' + KeyNames[key]);
			this.emit('down', key);
		}
	};

	private _handleKeyUp(e: KeyboardEvent) {
		//technically keyCode is deprecated but the alternative is using e.code which returns a string that can
		//be different depending on the browser. We'll hold on to using keyCode as long as feasible
		let key = e.keyCode ? e.keyCode : e.which;

		let state = this._keyStates[key];
		if (state.down === true) {
			state.released = true;
			state.down = false;
			this._dirtyKeys.push(key);

			this.emit('up-' + KeyNames[key]);
			this.emit('up', key);
		}
	};

	public bindKeys(name: string, keyCodes: number[]): void {
		if (this._keyBindings[name] === undefined) {
			this._keyBindings[name] = [];
		}
		keyCodes = ([] as number[]).concat(keyCodes);
		for (let ii = 0; ii < keyCodes.length; ii++) {
			if (this._keyBindings[name].indexOf(keyCodes[ii]) === -1) {
				this._keyBindings[name].push(keyCodes[ii]);
			}
		}
	};

	public unbindKeys(name: string, keyCodes: number[]): void {
		if (this._keyBindings[name] === undefined) {
			return;
		}
		keyCodes = ([] as number[]).concat(keyCodes);
		for (let ii = 0; ii < keyCodes.length; ii++) {
			let idx = this._keyBindings[name].indexOf(keyCodes[ii])
			if (idx !== -1) {
				this._keyBindings[name].splice(idx, 1);
			}
		}
		if (this._keyBindings[name].length === 0) {
			delete this._keyBindings[name];
		}
	};

	public getBoundKeys(keys: string | number | number[]): number[] {
		if (typeof keys === 'string') {
			keys = this._keyBindings[keys];
			return (keys === undefined) ? [] : keys;
		} else if (keys === -1) {
			//'any' key
			let allKeys: number[] = [];
			for (let ii = 0; ii < 255; ii++) {
				allKeys.push(ii);
			}
			return allKeys;
		}
		return ([] as number[]).concat(keys);
	};

	public keyPressed(keys: string | number | number[]): boolean {
		let keyIndices: number[] = this.getBoundKeys(keys);
		for (let ii = 0; ii < keyIndices.length; ii++) {
			if (this._keyStates[keys[ii]].pressed) {
				return true;
			}
		}
		return false;
	};

	public keyDown(keys: string | number | number[]): boolean {
		let keyIndices: number[] = this.getBoundKeys(keys);
		for (let ii = 0; ii < keyIndices.length; ii++) {
			if (this._keyStates[keys[ii]].down) {
				return true;
			}
		}
		return false;
	};


	public keyReleased(keys: string | number | number[]): boolean {
		let keyIndices: number[] = this.getBoundKeys(keys);
		for (let ii = 0; ii < keyIndices.length; ii++) {
			if (this._keyStates[keys[ii]].released) {
				return true;
			}
		}
		return false;
	};


};