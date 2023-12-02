type ShaderType = WebGLRenderingContext["VERTEX_SHADER"] | WebGLRenderingContext["FRAGMENT_SHADER"];

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
