import { Dispatcher } from "../core/dispatcher";

export interface IResolution {
	width: number;
	height: number;
};

export interface IScreenSettings {
	resolution: IResolution;
};

export class Screen extends Dispatcher {
	private _canvas: HTMLCanvasElement;

	private _targetWidth: number = 480;
	private _targetHeight: number = 640;

	private _screenWidth: number = this._targetWidth;
	private _screenHeight: number = this._targetHeight;

	private _contentWidth: number = this._targetWidth;
	private _contentHeight: number = this._targetHeight;

	private _resizeTaskId: number | null = null;

	public init(settings: IScreenSettings): void {
		this._canvas = document.createElement('canvas');
		this._targetWidth = settings.resolution.width || 480;
		this._targetHeight = settings.resolution.height || 640;

		document.body.appendChild(this._canvas);

		this._fitToScreen();

		window.addEventListener('resize', this._onResize.bind(this), false);
		window.addEventListener('orientationchange', this._onResize.bind(this), false);
	};

	private _getWindowSize(): IResolution {
		let windowSize = {
			width: 0,
			height: 0
		};

		windowSize.width = window.innerWidth;
		windowSize.height = window.innerHeight;

		return windowSize;
	};

	private _fitToScreen(): void {
		let windowSize = this._getWindowSize();

		let canvasRatio = this._targetWidth / this._targetHeight;
		let screenRatio = windowSize.width / windowSize.height;

		if (screenRatio > canvasRatio) {	//screenRatio is wider than target ratio.
			this._contentWidth = this._targetHeight * screenRatio;
			this._contentHeight = this._targetHeight;
		} else {
			this._contentWidth = this._targetWidth;
			this._contentHeight = this._targetWidth / screenRatio;
		};

		this._screenWidth = windowSize.width;
		this._screenHeight = windowSize.height;

		this._canvas.width = this._contentWidth;
		this._canvas.height = this._contentHeight;
		this._canvas.style.width = "" + this._screenWidth;
		this._canvas.style.height = "" + this._screenHeight;

		this._resizeTaskId = null;

		console.log('resize', {
			width: this._contentWidth,
			height: this._contentHeight,
			screenWidth: this._screenWidth,
			screenHeight: this._screenHeight
		});

		this.emit('resize', {
			width: this._contentWidth,
			height: this._contentHeight,
			screenWidth: this._screenWidth,
			screenHeight: this._screenHeight
		});
	};


	private _onResize(): void {
		// start a 100ms timeout, if interupted with a repeat event start over
		if (this._resizeTaskId != null) {
			window.clearTimeout(this._resizeTaskId);
		}
		this._resizeTaskId = window.setTimeout(this._fitToScreen.bind(this), 100);
	};

	public resize(width: number, height: number) {
		this._targetWidth = width;
		this._targetHeight = height;

		this._fitToScreen();
	};

	get canvas() { return this._canvas; };

	get width() { return this._canvas.width; };
	get height() { return this._canvas.height; };

	get contentWidth() { return this._contentWidth; };
	get contentHeight() { return this._contentHeight; };

	get screenWidth() { return this._screenWidth; };
	get screenHeight() { return this._screenHeight; };


};