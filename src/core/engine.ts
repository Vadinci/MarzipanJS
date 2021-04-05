import { Dispatcher } from './dispatcher';
import { Marzipan } from '../marzipan';
import { Matrix3 } from '../math/matrix3';
import { Scene } from './scene';
import { Entity } from './entity';

export type GameData = {
    currentTime: number;
    runningTime: number;
    deltaTime: number;
    frame: number;
    ticks: number;
    entity?: Entity;
};

export class Engine extends Dispatcher {
    private _drawDebug = false;

    public startTime: number = 0;
    public previousTime: number = 0;
    public currentTime: number = 0;
    public runningTime: number = 0;

    public accumulatedTime: number = 0;

    public ticks: number = 0;
    public frame: number = 0;

    public fps: number = 60;
    public spf: number = 1 / this.fps;
    public mspf: number = 1000 / this.fps;

    private _isRunning: boolean = false;

    private _scenes: Scene[] = [];
    private _addList: Scene[] = [];
    private _removeList: Scene[] = [];
    private loop: FrameRequestCallback;

    private tick(): void {
        let deltaTime;

        this.emit('preTick');

        this.currentTime = Date.now();
        deltaTime = this.currentTime - this.previousTime;
        this.runningTime = this.currentTime - this.startTime;

        this.previousTime = this.currentTime;

        this.accumulatedTime += deltaTime;

        this.ticks++;

        //prevent becoming too big
        if (this.accumulatedTime > 200) {
            this.accumulatedTime = 200;
        }

        while (this.accumulatedTime >= this.mspf) {
            this.update(this.spf);
            this.accumulatedTime -= this.mspf;
        }

        this.draw();

        if (this._drawDebug) {
            this.drawDebug();
        }

        this.emit('postTick');
    };

    private update(dt: number): void {
        this.frame++;

        let gameData = this._getGameData();
        gameData.deltaTime = dt;

        this.emit('preUpdate', gameData);

        //we update in reverse order. This way scenes on 'top' get updated first and have control over the scenes below them
        for (let ii = this._scenes.length - 1; ii >= 0; ii--) {
            this._scenes[ii].update(gameData);
        }

        this._handleAddList();
        this._handleRemoveList();

        this.emit('postUpdate', gameData);
    };

    private draw = function (): void {
        let gameData = this._getGameData();
        gameData.renderer = Marzipan.renderer;

        Marzipan.renderer.setTransform(new Matrix3());
        Marzipan.renderer.clear();

        this.emit('preDraw', gameData);

        for (let ii = 0; ii < this._scenes.length; ii++) {
            this._scenes[ii].draw(gameData);
        }

        this.emit('postDraw', gameData);
    };

    private drawDebug = function (): void {
        let gameData = this._getGameData();
        gameData.renderer = Marzipan.renderer;

        Marzipan.renderer.setTransform(new Matrix3());
        Marzipan.renderer.clear();

        this.emit('preDrawDebug', gameData);

        for (let ii = 0; ii < this._scenes.length; ii++) {
            this._scenes[ii].drawDebug(gameData);
        }

        this.emit('postDrawDebug', gameData);
    };

    public addScene(scene: Scene): void {
        let idx = this._scenes.indexOf(scene);
        if (idx !== -1) throw new Error("scene already added!");

        this._addList.push(scene);
    };

    public removeScene(scene: Scene): void {
        let idx = this._scenes.indexOf(scene);
        if (idx === -1) throw new Error("scene wasn't added!");

        this._removeList.push(scene);
    };

    private _getGameData(): GameData {
        return {
            currentTime: this.currentTime,
            runningTime: this.runningTime,
            deltaTime: 0,   //to be set 
            frame: this.frame,
            ticks: this.ticks
        };
    };

    private _handleAddList(): void {
        for (let ii = 0; ii < this._addList.length; ii++) {
            this._scenes.push(this._addList[ii]);
            this._addList[ii].start(this._getGameData());
        }

        if (this._addList.length !== 0) {
            this._scenes.sort((a, b) => {
                return a.layer - b.layer;
            });
        }

        this._addList = [];
    };

    private _handleRemoveList(): void {
        for (let ii = 0; ii < this._removeList.length; ii++) {
            this._removeList[ii].die(this._getGameData());
            this._scenes.splice(this._scenes.indexOf(this._removeList[ii]), 1);
        }
        this._removeList = [];
    };

    public getSceneByName(name: string): Scene | null {
        console.warn("not implemented!");
        return null;
    };

    public getSceneByTags(tags: string[]): Scene | null {
        console.warn("not implemented!");
        return null;
    };

    private _loop(): void {
        this.tick();
        window.requestAnimationFrame(this.loop);
    };

    public init(): void {
        if (this._isRunning) return;
        this._isRunning = true;

        this.startTime = Date.now();
        this.previousTime = this.startTime;

        this.loop = this._loop.bind(this);

        window.requestAnimationFrame(this.loop);
    };

    public setDebug(v: boolean): void {
        this._drawDebug = v;
    }
};
