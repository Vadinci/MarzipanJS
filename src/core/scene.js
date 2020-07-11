import Dispatcher from "./dispatcher";
import Transform from "../math/transform";

let Scene = function (settings) {
	let _entities = [];
	let _updateOrder = [];
	let _drawOrder = [];

	let _addList = [];
	let _removeList = [];

	let _name = settings.name || 'scene';
	let _layer = settings.layer || 0; 

	let _transform = new Transform();

	let start = function (gameData) {
		scene.emit('start');

		_handleAddList(gameData);
		_handleRemoveList(gameData);
		_sortEntities();

		for (let ii = _updateOrder.length - 1; ii >= 0; --ii) {
			gameData.entity = _updateOrder[ii];
			_updateOrder[ii].start(gameData);
		}
	};

	let update = function (gameData) {
		scene.emit('preUpdate', gameData);

		for (let ii = _updateOrder.length - 1; ii >= 0; --ii) {
			gameData.entity = _updateOrder[ii];
			_updateOrder[ii].update(gameData);
		}

		_handleAddList(gameData);
		_handleRemoveList(gameData);

		_sortEntities()

		scene.emit('postUpdate', gameData);
	};

	let draw = function (gameData) {
		scene.emit('preDraw', gameData);

		for (let ii = 0; ii < _drawOrder.length; ii++) {
			gameData.entity = _drawOrder[ii];
			_drawOrder[ii].draw(gameData);
		}

		scene.emit('postDraw', gameData);
	};


	let drawDebug = function (gameData) {
		scene.emit('preDrawDebug', gameData);

		for (let ii = 0; ii < _drawOrder.length; ii++) {
			gameData.entity = _drawOrder[ii];
			_drawOrder[ii].drawDebug(gameData);
		}

		scene.emit('postDrawDebug', gameData);
	};

	let die = function (gameData) {
		scene.emit('die');


		_handleAddList(gameData);
		_handleRemoveList(gameData);
		_sortEntities();

		for (let ii = _updateOrder.length - 1; ii >= 0; --ii) {
			gameData.entity = _updateOrder[ii];
			_updateOrder[ii].die(gameData);
		}
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

	let _handleAddList = function (gameData) {
		for (let ii = 0; ii < _addList.length; ii++) {
			_entities.push(_addList[ii]);
			gameData.entity = _addList[ii];
			_addList[ii].scene = scene;
			_addList[ii].start(gameData);

			_updateOrder.push(_addList[ii]);
			_drawOrder.push(_addList[ii]);

			if (!_addList[ii].transform.parent)
				_addList[ii].transform.setParent(_transform);
		}
		_addList = [];
	};

	let _handleRemoveList = function (gameData) {
		for (let ii = 0; ii < _removeList.length; ii++) {
			gameData.entity = _removeList[ii];
			_removeList[ii].die(gameData);
			_removeList[ii].scene = undefined;

			_updateOrder.splice(_updateOrder.indexOf(_removeList[ii]), 1);
			_drawOrder.splice(_drawOrder.indexOf(_removeList[ii]), 1);
			_entities.splice(_entities.indexOf(_removeList[ii]), 1);

			if (_addList[ii].transform.parent === _transform)
				_addList[ii].transform.setParent(null);
		}
		_removeList = [];
	};

	let _sortEntities = function () {
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
		for (let ii = 0; ii < _entities.length; ii++) {
			if (_entities[ii].name === name) result.push(_entities[ii]);
		}
		return result;
	};

	let getByTags = function (tags) {
		tags = [].concat(tags); //force to array;

		let result = [];
		for (let ii = 0; ii < _entities.length; ii++) {
			if (_entities[ii].hasTags(tags)) result.push(_entities[ii]);
		}
		return result;
	};

	let scene = {
		start,
		update,
		draw,
		drawDebug,
		die,

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
			layer: {
				get: () => _layer
			},


			transform: {
				get: () => _transform
			},

			position : {
				get : () => _transform.position
			},
			scale : {
				get : () => _transform.scale
			},
			rotation : {
				get : () => _transform.rotation,
				set : v => _transform.rotation = v
			}
		}
	);
	Dispatcher.make(scene);
	return scene;
};

export default Scene;
