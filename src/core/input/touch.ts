/**
 * Touch input system. While this system treats the mouse as an input, it only treats it as if it were a touch. That means:
 * 	- no mouse position while the mouse isn't pressed
 *  - no mouse buttons besides the left mouse
 */

import { Engine } from '../../core/engine';
import { Dispatcher } from '../../core/dispatcher';
import { Vector2 } from '../../math/vector2';
import { Screen } from '../../graphics/screen';

const MOUSE_ID = -1;	//unique 'touch' id for the mouse

export enum MouseState {
	UP,
	DOWN
};

export class Pointer {
	public position: Vector2 = new Vector2();
	public start: Vector2 = new Vector2();
	public id: number;
	public startTime: number;

	constructor(id: number, x: number, y: number) {
		this.start.set(x, y);
		this.position.set(x, y);
		this.id = id;
		this.startTime = Date.now();
	};
};


export class Touch extends Dispatcher {
	private _pointers: { [key: number]: Pointer } = {};

	private _mouseState: MouseState = MouseState.UP;
	private _mousePos: Vector2 = new Vector2(0, 0);

	private _canvasScale: Vector2 = new Vector2(1, 1);

	//TODO screen
	public init(engine: Engine, screen: Screen): void {
		const canvas = screen.canvas;

		engine.on('postUpdate', this._flush.bind(this));

		canvas.addEventListener('touchstart', this._onTouchStart.bind(this));
		canvas.addEventListener('touchmove', this._onTouchMove.bind(this));
		canvas.addEventListener('touchend', this._onTouchEnd.bind(this));

		canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
		canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
		canvas.addEventListener('mouseup', this._onMouseUp.bind(this));

		screen.on('resize', this._updateCanvasSize.bind(this));
		this._updateCanvasSize(screen);
	};

	//every update, the input needs to be flushed, after any code execution that might want to use input data.
	public _flush(): void {

	};

	/** Core */
	private _createPointer(id: number, x: number, y: number): void {
		if (this._pointers[id]) {
			console.warn("pointer with given id already exists!");
			return;
		}

		x /= this._canvasScale.x;
		y /= this._canvasScale.y;

		let pointer = new Pointer(id, x, y);
		this._pointers[id] = pointer;

		this.emit('start', pointer);
	};

	private _updatePointer(id: number, x: number, y: number): void {
		if (!this._pointers[id]) {
			console.warn("pointer with given id doesn't exist");
			return;
		}

		x /= this._canvasScale.x;
		y /= this._canvasScale.y;

		let pointer = this._pointers[id];
		pointer.position.x = x;
		pointer.position.y = y;

		this.emit('move', pointer);
	};

	private _removePointer(id: number): void {
		if (!this._pointers[id]) {
			console.warn("pointer with given id doesn't exist");
			return;
		}

		let pointer = this._pointers[id];

		delete this._pointers[id];
		this.emit('end', pointer);
	};


	/** Event Handlers */
	private _onTouchStart(evt: TouchEvent): void {
		evt.preventDefault();

		for (let ii = 0; ii < evt.changedTouches.length; ii++) {
			let touch = evt.changedTouches[ii];
			this._createPointer(touch.identifier, touch.pageX, touch.pageY);
		}
	};

	private _onTouchMove(evt: TouchEvent): void {
		evt.preventDefault();

		for (let ii = 0; ii < evt.changedTouches.length; ii++) {
			let touch = evt.changedTouches[ii];
			this._updatePointer(touch.identifier, touch.pageX, touch.pageY);
		}
	};

	private _onTouchEnd(evt: TouchEvent): void {
		evt.preventDefault();

		for (let ii = 0; ii < evt.changedTouches.length; ii++) {
			let touch = evt.changedTouches[ii];
			this._removePointer(touch.identifier);
		}
	};

	private _onMouseDown(evt: MouseEvent): void {
		evt.preventDefault();

		this._mouseState = MouseState.DOWN;

		this._createPointer(MOUSE_ID, this._mousePos.x, this._mousePos.y);
	};

	private _onMouseMove(evt: MouseEvent): void {
		evt.preventDefault();

		if (evt.offsetX) {
			this._mousePos.x = evt.offsetX;
			this._mousePos.y = evt.offsetY;
		} /*else if (evt.layerX) {
			this._mousePos.x = evt.layerX;
			this._mousePos.y = evt.layerY;
		}*/

		if (this._mouseState === MouseState.UP) return;

		this._updatePointer(MOUSE_ID, this._mousePos.x, this._mousePos.y);
	};

	private _onMouseUp(evt: MouseEvent) {
		evt.preventDefault();

		this._mouseState = MouseState.UP;

		this._removePointer(MOUSE_ID);

	};

	private _updateCanvasSize(screen: Screen): void {
		this._canvasScale.x = screen.screenWidth / screen.contentWidth;
		this._canvasScale.y = screen.screenHeight / screen.contentHeight;
	};
};
