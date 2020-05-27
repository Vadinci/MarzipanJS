import Dispatcher from "../core/dispatcher";

let _canvas;

let init = function (settings) {
	//TODO way more functionality
	_canvas = document.createElement('canvas');
	_canvas.width = settings.width || 480;
	_canvas.height = settings.height || 640;

	document.body.appendChild(_canvas);
};

let resize = function (width, height) {
	_canvas.width = width;
	_canvas.height = height;

	Screen.emit('resize', {
		width: _canvas.width,
		height: _canvas.height
	});
};

let Screen = {
	init,
	resize
};

Dispatcher.make(Screen);

Object.defineProperties(Screen, {
	canvas: {
		get: () => _canvas
	},
	width : {
		get : () => _canvas.width
	},
	height : {
		get : () => _canvas.height
	}
});

export default Screen;