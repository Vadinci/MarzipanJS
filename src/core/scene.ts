import { Dispatcher } from "./dispatcher";
import { Transform } from "../math/transform";
import { Entity } from "./entity";
import { GameData } from "./engine";

export interface ISceneSettings {
	name?: string;
	layer?: number;
};

export class Scene extends Dispatcher {
	private _entities: Entity[] = [];
	private _updateOrder: Entity[] = [];
	private _drawOrder: Entity[] = [];

	private _addList: Entity[] = [];
	private _removeList: Entity[] = [];

	private _name: string = 'scene';
	private _layer: number = 0;

	private _transform: Transform = new Transform();

	constructor(settings: ISceneSettings) {
		super();

		if (settings.name !== void (0)) this._name = settings.name;
		if (settings.layer !== void (0)) this._layer = settings.layer;
	};

	public start(gameData: GameData): void {
		this.emit('start');

		this._handleAddList(gameData);
		this._handleRemoveList(gameData);
		this._sortEntities();
	};

	public update(gameData: GameData): void {
		this.emit('preUpdate', gameData);

		for (let ii = this._updateOrder.length - 1; ii >= 0; --ii) {
			gameData.entity = this._updateOrder[ii];
			if (!gameData.entity.active) continue;
			gameData.entity.update(gameData);
		}

		this._handleAddList(gameData);
		this._handleRemoveList(gameData);

		this._sortEntities()

		this.emit('postUpdate', gameData);
	};

	public draw(gameData: GameData): void {
		this.emit('preDraw', gameData);

		for (let ii = 0; ii < this._drawOrder.length; ii++) {
			gameData.entity = this._drawOrder[ii];
			if (!gameData.entity.visible) continue;
			gameData.entity.draw(gameData);
		}

		this.emit('postDraw', gameData);
	};

	public drawDebug(gameData: GameData): void {
		this.emit('preDrawDebug', gameData);

		for (let ii = 0; ii < this._drawOrder.length; ii++) {
			gameData.entity = this._drawOrder[ii];
			if (!gameData.entity.visible) continue;
			gameData.entity.drawDebug(gameData);
		}

		this.emit('postDrawDebug', gameData);
	};

	public die(gameData: GameData): void {
		this.emit('die');

		this._handleAddList(gameData);
		this._handleRemoveList(gameData);
		this._sortEntities();

		for (let ii = this._updateOrder.length - 1; ii >= 0; --ii) {
			gameData.entity = this._updateOrder[ii];
			this._updateOrder[ii].die(gameData);
		}
	};

	public addEntity(entity: Entity): void {
		if (this._addList.indexOf(entity) !== -1) {
			return;
		}
		this._addList.push(entity);
	};

	public removeEntity(entity: Entity): void {
		if (this._removeList.indexOf(entity) !== -1) {
			return;
		}
		this._removeList.push(entity);
	};

	public _handleAddList(gameData: GameData): void {
		for (let ii = 0; ii < this._addList.length; ii++) {
			this._entities.push(this._addList[ii]);
			gameData.entity = this._addList[ii];
			this._addList[ii].scene = this;
			this._addList[ii].start(gameData);

			this._updateOrder.push(this._addList[ii]);
			this._drawOrder.push(this._addList[ii]);

			if (!this._addList[ii].transform.parent)
				this._addList[ii].transform.setParent(this._transform);
		}
		this._addList = [];
	};

	public _handleRemoveList(gameData: GameData) {
		for (let ii = 0; ii < this._removeList.length; ii++) {
			gameData.entity = this._removeList[ii];
			this._removeList[ii].die(gameData);
			this._removeList[ii].scene = null;

			this._updateOrder.splice(this._updateOrder.indexOf(this._removeList[ii]), 1);
			this._drawOrder.splice(this._drawOrder.indexOf(this._removeList[ii]), 1);
			this._entities.splice(this._entities.indexOf(this._removeList[ii]), 1);

			if (this._removeList[ii].transform.parent === this._transform)
				this._removeList[ii].transform.setParent(null);
		}
		this._removeList = [];
	};

	public _sortEntities() {
		//sort update order
		//TODO in place sorting
		this._updateOrder.sort(function (a, b) {
			return a.priority - b.priority;
		});

		//sort draw order
		//TODO in place sorting
		this._drawOrder.sort(function (a, b) {
			return a.z - b.z;
		});
	};


	public getByName(name: string): Entity[] {
		let result: Entity[] = [];
		for (let ii = 0; ii < this._entities.length; ii++) {
			if (this._entities[ii].name === name) result.push(this._entities[ii]);
		}
		return result;
	};

	public getByTags(tags: string[]): Entity[] {
		let result: Entity[] = [];
		for (let ii = 0; ii < this._entities.length; ii++) {
			if (this._entities[ii].hasTags(tags)) result.push(this._entities[ii]);
		}
		return result;
	};

	public get name() { return this._name; };

	public get layer() { return this._layer; };

	public get transform() { return this._transform; };
};