
/*
TODO:
	Blend modes
	Anti Alias
	Auto-clear?
	Handle Resize
*/

import { Matrix3 } from '../../math/matrix3';
import { Vector2 } from '../../math/vector2';
import { IPicture } from '../picture';
import { Renderer, IRendererSettings } from '../renderer';

const TODO = () => console.warn('todo');

export class WebRenderer extends Renderer {
	private _mainCanvas: HTMLCanvasElement;
	private _currentCanvas: HTMLCanvasElement;
	private _currentContext: CanvasRenderingContext2D;

	constructor(settings: IRendererSettings) {
		super(settings);

		this._mainCanvas = this._screen.canvas;
		this._currentCanvas = this._mainCanvas;

		let context = this._mainCanvas.getContext('2d');
		if (!context) {
			throw "error initializing renderer";
		} else {
			this._currentContext = context;
		}
	};


	public save(): void {
		this._currentContext.save();
	};

	public restore(): void {
		this._currentContext.restore();
	};

	public clear(): void {
		this._currentContext.clearRect(0, 0, this._currentCanvas.width, this._currentCanvas.height);
	};

	public translate = TODO;

	public scale(sx: number, sy: number): void {
		this._currentContext.scale(sx, sy);
	};

	public rotate = TODO;

	public setTransform(transform: Matrix3): void {
		//TODO transform the matrix object to conform to the new DomMatrix object?
		this._currentContext.setTransform(
			transform.mat[0], transform.mat[3],
			transform.mat[1], transform.mat[4],
			transform.mat[2], transform.mat[5]
		);
	};

	public setAlpha = TODO;

	public drawLine(start: Vector2, end: Vector2, color: any, width: number): void {
		this._currentContext.beginPath();

		this._currentContext.strokeStyle = color;
		this._currentContext.lineWidth = width;

		this._currentContext.moveTo(start.x, start.y);
		this._currentContext.lineTo(end.x, end.y);

		this._currentContext.stroke();
	};

	public drawRect(start: Vector2, end: Vector2, color: any): void {
		this._currentContext.fillStyle = color;
		this._currentContext.fillRect(start.x, start.y, end.x - start.x, end.y - start.y);
	};

	public drawCircle(pos: Vector2, radius: number, color: any, width: number): void {
		this._currentContext.beginPath();

		this._currentContext.strokeStyle = color;
		this._currentContext.lineWidth = width;

		this._currentContext.arc(pos.x, pos.y, radius, 0, Math.PI * 2);

		this._currentContext.stroke();
	};

	public drawPolygon = TODO;

	public drawPicture(picture: IPicture, x: number, y: number): void {
		this._currentContext.drawImage(picture.image, picture.x, picture.y, picture.width, picture.height, x, y, picture.width, picture.height);
	};

	public drawPicturePart(picture: IPicture, sx: number, sy: number, sw: number, sh: number, x: number, y: number): void {
		this._currentContext.drawImage(picture.image, picture.x + sx, picture.y + sy, sw, sh, x, y, sw, sh);
	};

	public drawImage(image: HTMLImageElement, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
		this._currentContext.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
	};
};