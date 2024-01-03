type ShaderType = WebGLRenderingContext["VERTEX_SHADER"] | WebGLRenderingContext["FRAGMENT_SHADER"];

export function getGl(canvas: HTMLCanvasElement): WebGLRenderingContext {
	const gl = canvas.getContext("webgl");
	if (gl == null) {
		throw "Can't use WebGL apparently";
	}
	return gl;
}

export function createShader(gl: WebGLRenderingContext, type: ShaderType, source: string): WebGLShader {
	const shader = gl.createShader(type);
	if (shader == null) {
		throw "What're you gonna do, am I right?";
	}

	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	} else {
		console.log(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		throw "This time you probably actually messed something up";
	}
}

export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
	const program = gl.createProgram();
	if (program == null) {
		throw "Enough already, sheesh";
	}

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return program;
	} else {
		console.log(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		throw "Yep def your fault this time";
	}
}

export function makeBuffer(gl: WebGLRenderingContext): WebGLBuffer {
	const bufferId = gl.createBuffer();
	if (bufferId == null) {
		throw "Coulnd't make a new buffer";
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	return bufferId;
}

export function setData(gl: WebGLRenderingContext, bufferId: WebGLBuffer, bufferData: number[]) {
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
}

export function assignBuffer(gl: WebGLRenderingContext, bufferId: WebGLBuffer, attributeLocation: number, size: number) {
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.enableVertexAttribArray(attributeLocation);

	// Tell the attribute how to get data out of the buffer
	const type = gl.FLOAT;   // the data is 32bit floats
	const normalize = false; // don't normalize the data
	const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	const attribOffset = 0;  // start at the beginning of the buffer
	gl.vertexAttribPointer(attributeLocation, size, type, normalize, stride, attribOffset);
}
