import ENSURE from '../utils/ensure';
import Engine from './engine';
import Screen from '../graphics/screen';

let init = function (settings) {
	ENSURE(settings);
};

let addSystem = function (system) {
	if (Input[system.key]) {
		console.warn('already initialized instance of input system: ' + system.key);
		return;
	}

	system.init(Screen.canvas);

	Input[system.key] = system;
};


let Input = {
	init,

	addSystem
};

export default Input;