/*
TODO:
    Blend modes
    Anti Alias
    Auto-clear?
    Handle Resize
*/

import ENSURE from '../../utils/ensure';

const TODO = () => console.warn('todo');

let WebRenderer = function (settings) {
	ENSURE(settings);
	ENSURE(settings.screen);

	let _mainCanvas = ENSURE(settings.screen.canvas);
	let _currentCanvas = _mainCanvas;
	let _currentContext = _currentCanvas.getContext('2d');

	let save = () => {
		_currentContext.save();
	};

	let restore = () => {
		_currentContext.restore();
	};

	let clear = function () {
		_currentContext.clearRect(0, 0, _currentCanvas.width, _currentCanvas.height);
	};

	let translate = TODO;
	let scale = TODO;
	let rotate = TODO;
	let setTransform = function (transform) {
		//TODO transform the matrix object to conform to the new DomMatrix object?
		_currentContext.setTransform(
			transform[0], transform[3],
			transform[1], transform[4],
			transform[2], transform[5]
		);
	};
	let setAlpha = TODO;

	let drawLine = function (start, end, color, width) {
		_currentContext.beginPath();

		_currentContext.strokeStyle = color;
		_currentContext.lineWidth = width;

		_currentContext.moveTo(start.x, start.y);
		_currentContext.lineTo(end.x, end.y);

		_currentContext.stroke();
	};

	let drawRect = function (start, end, color) {
		_currentContext.fillStyle = color;
		_currentContext.fillRect(start.x, start.y, end.x - start.x, end.y - start.y);
	};

	let drawCircle = TODO;
	let drawPolygon = TODO;

	let drawPicture = function (picture, x, y) {
		_currentContext.drawImage(picture.image, picture.x, picture.y, picture.width, picture.height, x, y, picture.width, picture.height);
	};

	let drawPicturePart = function (picture, sx, sy, sw, sh, x, y) {
		_currentContext.drawImage(picture.image, picture.x + sx, picture.y + sy, sw, sh, x, y, sw, sh);
	};

	let drawImage = function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
		_currentContext.drawImage(picture.image, picture.x, picture.y, picture.width, picture.height, x, y, picture.width, picture.height);
	}

	return {
		save,
		restore,
		clear,

		translate,
		scale,
		rotate,
		setTransform,
		setAlpha,

		drawLine,
		drawRect,
		drawCircle,
		drawPolygon,

		drawPicture,
		drawPicturePart,
		drawImage
	};
};

export default WebRenderer;