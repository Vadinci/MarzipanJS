let _processor;
let _groups = {};
let _saveTasks = {};

let setProcessor = function (processor) {
	_processor = processor;
};

let fetchGroup = function (group, onComplete) {
	_processor.fetch(group, data => {
		_groups[group] = data || {};
		onComplete && onComplete();
	});
};

let load = function (group, key) {
	if (!_groups[group]) {
		_groups[group] = {};
		fetchGroup(group);
	}
	return _groups[group][key];
};

let save = function (group, key, value) {
	if (!_groups[group]) {
		_groups[group] = {};
		fetchGroup(group);
	}
	_groups[group][key] = value;
	_queueSaveTask(group);
};

//queues a save task, a few ms into the future. This prevents a lot of modifications to the same save group at once (i.e. when completing a level) creating a lot of upstreams,
//while one would suffice
let _queueSaveTask = function (group) {
	if (_saveTasks[group]) return;

	_saveTasks[group] = window.setTimeout(() => {
		_saveTasks[group] = undefined;
		_processor.write(group, _groups[group]);
	}, 10);
};

const PlayerData = {
	setProcessor,
	fetchGroup,

	load,
	save
};
export default PlayerData;