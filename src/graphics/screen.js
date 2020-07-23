import Dispatcher from "../core/dispatcher";

let _canvas;

let _targetWidth = 480;
let _targetHeight = 640;

let _screenWidth = _targetWidth;
let _screenHeight = _targetHeight;

let _contentWidth = _targetWidth;
let _contentHeight = _targetHeight;

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

	if (screenRatio > canvasRatio) {	//screenRatio is wider than target ratio.
		_contentWidth = _targetHeight * screenRatio;
		_contentHeight = _targetHeight;
	} else {
		_contentWidth = _targetWidth;
		_contentHeight = _targetWidth / screenRatio;
	};

	_screenWidth = windowSize.width;
	_screenHeight = windowSize.height;

	_canvas.width = _contentWidth;
	_canvas.height = _contentHeight;
	_canvas.style.width = _screenWidth;
	_canvas.style.height = _screenHeight;

	_resizeTaskId = null;

	console.log('resize', {
		width: _contentWidth,
		height: _contentHeight,
		screenWidth: _screenWidth,
		screenHeight: _screenHeight
	});

	Screen.emit('resize', {
		width: _contentWidth,
		height: _contentHeight,
		screenWidth: _screenWidth,
		screenHeight: _screenHeight
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

	width: { get: () => _canvas.width },
	height: { get: () => _canvas.height },

	contentWidth: { get: () => _contentWidth },
	contentHeight: { get: () => _contentHeight },

	screenWidth: { get: () => _screenWidth },
	screenHeight: { get: () => _screenHeight },

});

export default Screen;