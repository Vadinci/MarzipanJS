import Screen from "../screen";

const createShader = function (gl, type, source) {
	let shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		return shader;
	}

	console.warn(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
	throw "problem compiling shader!";
};

let Shader = function () {
	let gl = Screen.canvas.getContext('webgl');

	let _vertexShader;
	let _fragmentShader;
	let _glProgram;
	let _isLinked = false;

	let setVertexShader = function (source) {
		_vertexShader = createShader(gl, gl.VERTEX_SHADER, source);
	};

	let setFragmentShader = function (source) {
		_fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, source);
	};

	let link = function () {
		_glProgram = gl.createProgram();
		if (_vertexShader) gl.attachShader(_glProgram, _vertexShader);
		if (_fragmentShader) gl.attachShader(_glProgram, _fragmentShader);

		gl.linkProgram(_glProgram);

		if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
			return true;
		}

		console.warn(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		throw "Error linking program";
	};

	let program = {
		setVertexShader,
		setFragmentShader,
		link
	};

	Object.defineProperties(program, {
		glProgram: {
			get: () => {
				if (!_isLinked) throw "can't use unlinked GL program";
				return _glProgram;
			}
		}
	});

	return program;
};

export default Shader;