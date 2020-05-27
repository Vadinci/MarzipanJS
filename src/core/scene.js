import Dispatcher from "./dispatcher";
import Transform from "../math/transform";

let Scene = function () {
	let _entities = [];
	let _updateOrder = [];
	let _drawOrder = [];

	let _addList = [];
	let _removeList = [];

	let _name = 'scene';

	let _transform = new Transform();

	let update = function (data) {
		scene.emit('preUpdate', data);

		for (let ii = _updateOrder.length - 1; ii >= 0; --ii) {
			data.entity = _updateOrder[ii];
			_updateOrder[ii].update(data);
		}

		//check if any entities need to be added
		for (let ii = 0; ii < _addList.length; ii++) {
			_entities.push(_addList[ii]);
			data.entity = _addList[ii];
			_addList[ii].scene = scene;
			_addList[ii].start(data);

			_updateOrder.push(_addList[ii]);
			_drawOrder.push(_addList[ii]);
			_addList[ii].transform.setParent(_transform);
		}
		_addList = [];

		//check if any entities need to be removed
		for (let ii = 0; ii < _removeList.length; ii++) {
			data.entity = _removeList[ii];
			_removeList[ii].die(data);
			_removeList[ii].scene = undefined;

			_updateOrder.splice(_updateOrder.indexOf(_removeList[ii]), 1);
			_drawOrder.splice(_drawOrder.indexOf(_removeList[ii]), 1);
			_entities.splice(_entities.indexOf(_removeList[ii]), 1);
		}
		_removeList = [];

		sortEntities()

		scene.emit('postUpdate', data);
	};

	let draw = function (data) {
		scene.emit('preDraw', data);

		for (let ii = 0; ii < _drawOrder.length; ii++) {
			data.entity = _drawOrder[ii];
			_drawOrder[ii].draw(data);
		}

		scene.emit('postDraw', data);
	};


	let drawDebug = function (data) {
		scene.emit('preDrawDebug', data);

		for (let ii = 0; ii < _drawOrder.length; ii++) {
			data.entity = _drawOrder[ii];
			_drawOrder[ii].drawDebug(data);
		}

		scene.emit('postDrawDebug', data);
	};


	let addEntity = function (entity) {
		if (_addList.indexOf(entity) !== -1) {
			return;
		}
		_addList.push(entity);
	};

	let removeEntity = function (entity) {
		if (_removeList.indexOf(entity) !== -1) {
			return;
		}
		_removeList.push(entity);
	};

	let sortEntities = function () {
		//sort update order
		//TODO in place sorting
		_updateOrder.sort(function (a, b) {
			return a.priority - b.priority;
		});

		//sort draw order
		//TODO in place sorting
		_drawOrder.sort(function (a, b) {
			return a.z - b.z;
		});
	};


	let getByName = function (name) {
		let result = [];
		for (let ii = 0; ii < entities.length; ii++) {
			if (entities[ii].name === name) result.push(entities[ii]);
		}
		return result;
	};

	let getByTags = function (tags) {
		tags = [].concat(tags); //force to array;

		let result = [];
		for (let ii = 0; ii < entities.length; ii++) {
			if (entities[ii].hasTags(tags)) result.push(entities[ii]);
		}
		return result;
	};

	let scene = {
		update,
		draw,
		drawDebug,

		addEntity,
		removeEntity,

		getByName,
		getByTags,

		setName: name => _name = name
	};
	Object.defineProperties(scene,
		{
			name: {
				get: () => _name
			},
			transform: {
				get: () => _transform
			}
		}
	);
	Dispatcher.make(scene);
	return scene;
};

export default Scene;
