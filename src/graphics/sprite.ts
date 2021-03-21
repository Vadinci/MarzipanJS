//TODO add pause and resume;
//TODO documentation

import { Dispatcher } from "../core/dispatcher";
import { Vector2 } from "../math/vector2";
import { Transform } from "../math/transform";
import { Rectangle } from "../math/rectangle";
import { Marzipan } from "../marzipan";
import { Component } from "../core/component";
import { IPicture } from "./picture";
import { Renderer } from "./renderer";

export class Animation extends Dispatcher {
	private _loop: boolean = false;
	private _isPlaying: boolean = false;

	private _frames: number[];
	private _frameDurations: number[];

	private _currentFrameIdx: number = 0;
	private _currentFrameTime: number = 0;

	constructor(settings: any) {	//TODO type
		super();

		this._loop = settings.loop || false;
		this._frames = settings.frames || [0];

		this._frameDurations = [];

		for (let ii = 0; ii < this._frames.length; ii++) {
			let duration = 1 / 24;	//a default speed of 24 frames per second //TODO move to const

			if (settings.fps) duration = 1 / settings.fps;
			if (settings.frameDurations && settings.frameDurations.length > ii) duration = settings.frameDurations[ii];

			this._frameDurations[ii] = duration;
		}
	};

	public start(): void {
		this._isPlaying = true;

		this._currentFrameTime = 0;
		this._currentFrameIdx = 0;
		this.emit('start');
	};

	public stop(): void {
		this._isPlaying = false;

		this.emit('stop');
	};

	public update(data: any): void {
		if (!this._isPlaying) return;

		this._currentFrameTime += data.deltaTime;

		while (this._currentFrameTime > this._frameDurations[this._currentFrameIdx]) {
			this._currentFrameTime -= this._frameDurations[this._currentFrameIdx];
			this._currentFrameIdx++;

			if (this._currentFrameIdx >= this._frames.length) {
				this.emit('complete');
				if (!this._loop) {
					this._currentFrameIdx = this._frames.length - 1;
					this._isPlaying = false;
					return;
				} else {
					this._currentFrameIdx = 0;
					this.emit('loop');
				}
			}
		}
	};

	get frame(): number { return this._frames[this._currentFrameIdx]; };
};

export class Sprite extends Component {
	private _picture: IPicture;
	private _transform: Transform;
	private _frame: Rectangle;

	private _frameIdx: number;
	private _frameCountX: number;
	private _frameCountY: number;

	private _origin: Vector2;

	private _currentAnimation: Animation | null;
	private _animations: { [key: string]: Animation } = {};

	public name = "sprite";

	constructor(settings: any) {
		super();

		this._picture = settings.picture || Marzipan.assets.get<IPicture>('picture', settings.pictureName);

		this._transform = new Transform();

		this._frame = new Rectangle(0, 0, this._picture.width, this._picture.height);
		if (settings.frameWidth && settings.frameHeight) {
			this._frame.set(0, 0, settings.frameWidth, settings.frameHeight);
		} else if (settings.frameCountX && settings.frameCountY) {
			this._frame.set(0, 0, Math.floor(this._picture.width / settings.frameCountX), Math.floor(this._picture.height / settings.frameCountY));
		}

		this._frameIdx = 0;
		this._frameCountX = Math.floor(this._picture.width / this._frame.width);
		this._frameCountY = Math.floor(this._picture.height / this._frame.height);

		this._origin = settings.origin || new Vector2(0, 0);
		if (settings.originRelative) {
			this._origin.set(settings.originRelative.x * this._frame.width, settings.originRelative.y * this._frame.height);
		}

		this._currentAnimation = null;
		this._animations = {};

		for (let key in settings.animations) {
			let animData = settings.animations[key];
			this.addAnimation(key, new Animation(animData));

			if (!this._currentAnimation) {
				this._currentAnimation = this._animations[key];
				this._currentAnimation.start();
			}
		}
	};

	addAnimation(name: string, animation: Animation): Animation {
		if (this._animations[name]) {
			//TODO throw stuff? It's not wrong to override an animation :/
		}

		this._animations[name] = animation;
		if (!this._currentAnimation) this._currentAnimation = animation;

		return animation;
	};


	play(name: string, onComplete: () => void): Animation | null {
		let animation = this._animations[name];
		if (!animation) {
			console.warn('animation with name ' + name + ' does not exist!');
			return null;
		}
		//TODO clear events of old animation
		if (onComplete) animation.once('complete', onComplete);
		this._currentAnimation = animation;
		animation.start();

		return animation;
	};

	setFrame(idx: number): void {
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
	public added(data: any): void {
		this._transform.setParent(data.entity.transform);
	};

	public update(data: any): void {
		if (!this._currentAnimation) return;

		let oldFrameIdx = this._frameIdx;
		this._currentAnimation.update(data);
		if (this._currentAnimation.frame !== oldFrameIdx) {
			this.setFrame(this._currentAnimation.frame);
		}
	};

	public draw(data: {
		renderer: Renderer
	}): void {
		data.renderer.setTransform(this._transform.globalMatrix);

		data.renderer.drawPicturePart(
			this._picture,
			this._frame.x, this._frame.y,
			this._frame.width, this._frame.height,
			-this._origin.x, -this._origin.y
		);
	};

	get frame() { return this._frame; };
	get transform() { return this._transform; };
};