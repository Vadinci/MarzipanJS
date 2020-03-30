import ENSURE from '../../utils/ensure';
import Program from './program';

import * as DefaultShader from './defaultshader';

const TODO = () => console.warn('todo');

let GLRenderer = function (settings) {
	ENSURE(settings);
	ENSURE(settings.screen);

	let _canvas = settings.screen.canvas;
	let gl = _canvas.getContext('webgl');

	//let _transformMatrix = Matrix3.identity();

	let _defaultProgram = new Program();
	_defaultProgram.setVertexShader(DefaultShader.vert);
	_defaultProgram.setFragmentShader(DefaultShader.frag);
	_defaultProgram.compile();

	if (!gl) {
		TODO();
		throw "WebGL is not supported!";
	}

	let clear = function () {
		gl.clearColor(1, 0, 1, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
	};


	let setTransform = function (m) {
		//TODO is this neccesary? I think the batcher should handle transform related stuff
	};

	let setProgram = function (program) {
		gl.useProgram(program.glprogram);
	};

	let setTexture = function (tex) {
		gl.bindTexture(gl.TEXTURE_2D, tex);
	};

	let pushVertices = function (vertices) {

	};

	let pushUVs = function (UVs) {

	};

	let draw = function () {

	};

	let renderer = {
		clear,

		setTransform,

		setProgram,
		setTexture,
		pushVertices,
		pushUVs,
		draw
	};

	clear();
	setProgram(_defaultProgram);
	return renderer;
};

export default GLRenderer;