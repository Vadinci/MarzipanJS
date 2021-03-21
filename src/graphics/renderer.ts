import { Matrix3 } from "../math/matrix3";
import { Vector2 } from "../math/vector2";
import { IPicture } from "./picture";
import { Screen } from "./screen";

export interface IRendererSettings {
	screen: Screen;
};

export class Renderer {
	protected _screen: Screen;

	constructor(settings: IRendererSettings) {
		this._screen = settings.screen;
	};

	public save(): void { };
	public restore(): void { };
	public clear(): void { };

	public translate(): void { };
	public scale(sx: number, sy: number): void { };
	public rotate(): void { };
	public setTransform(transform: Matrix3): void { };
	public setAlpha(alpha: number): void { };

	public drawLine(start: Vector2, end: Vector2, color: any, width: number): void { };
	public drawRect(start: Vector2, end: Vector2, color: any): void { };
	public drawCircle(pos: Vector2, radius: number, color: any, width: number): void { };
	public drawPolygon(): void { };

	public drawPicture(picture: IPicture, x: number, y: number): void { };
	public drawPicturePart(picture: IPicture, sx: number, sy: number, sw: number, sh: number, x: number, y: number): void { };
	public drawImage(image: HTMLImageElement, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void { };
};