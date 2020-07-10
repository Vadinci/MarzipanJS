import Dispatcher from "../core/dispatcher";

let _canvas;

let _targetWidth = 480;
let _targetHeight = 640;

let _resizeTaskId = null;

//TODO listen for screen resize

let init = function (settings) {
	_canvas = document.createElement('canvas');
	_targetWidth = settings.width || 480;
	_targetHeight = settings.height || 640;

	document.body.appendChild(_canvas);

	_fitToScreen();

	window.addEventListener('resize', _onResize, false);
	window.addEventListener('orientationchange', _onResize, false);
};

let _getWindowSize = function () {
	let windowSize = {
		width: 0,
		height: 0
	};
	if (window.dapi) {
		windowSize.width = window.dapi.getScreenSize().width;
		windowSize.height = window.dapi.getScreenSize().height;
	} else if (window.mraid) {
		windowSize.width = window.mraid.getMaxSize().width;
		windowSize.height = window.mraid.getMaxSize().height;
	} else {
		windowSize.width = window.innerWidth;
		windowSize.height = window.innerHeight;
	}
	return windowSize;
};

let _fitToScreen = function () {
	let windowSize = _getWindowSize();

	let canvasRatio = _targetWidth / _targetHeight;
	let screenRatio = windowSize.width / windowSize.height;

	if (screenRatio > canvasRatio){	//screenRatio is wider than target ratio.
		_canvas.width = _targetHeight * screenRatio;
		_canvas.height = _targetHeight;
	} else {
		_canvas.width = _targetWidth;
		_canvas.height = _targetWidth / screenRatio;
	};

	_canvas.style.width = windowSize.width;
	_canvas.style.height = windowSize.height;

	_resizeTaskId = null;

	Screen.emit('resize', {
		width: _canvas.width,
		height: _canvas.height
	});
};

let _onResize = function () {
	// start a 100ms timeout, if interupted with a repeat event start over
	if (_resizeTaskId != null) {
		window.clearTimeout(_resizeTaskId);
	}
	_resizeTaskId = window.setTimeout(_fitToScreen, 100);
};

let resize = function (width, height) {
	_targetWidth = width;
	_targetHeight = height;

	_fitToScreen();
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
	width: {
		get: () => _canvas.width
	},
	height: {
		get: () => _canvas.height
	}
});

export default Screen;