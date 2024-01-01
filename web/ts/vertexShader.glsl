uniform vec2 u_resolution;

attribute vec2 a_position;
attribute vec3 a_color;

varying vec3 v_vertex_color;

void main() {
	// convert the position from pixels to 0.0 to 1.0
	vec2 zeroToOne = a_position / u_resolution;

	// convert from 0->1 to 0->2
	vec2 zeroToTwo = zeroToOne * 2.0;

	// convert from 0->2 to -1->+1 (clip space)
	vec2 clipSpace = zeroToTwo - 1.0;

	// outputs
	gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
	v_vertex_color = a_color;
}
