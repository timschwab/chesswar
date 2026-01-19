uniform vec2 u_screen;
uniform float u_scale;
uniform vec2 u_left_top;
uniform vec3 u_color;

attribute vec2 a_vertex;

varying vec3 v_vertex_color;

void main() {
	// Find the scale-adjusted position
	vec2 scaleAdjusted = a_vertex * u_scale;

	// Find the leftTop-adjusted position
	vec2 leftTopAdjusted = scaleAdjusted + u_left_top;

	// Convert from 0->n to 0->1
	vec2 zeroToOne = leftTopAdjusted / u_screen;

	// Convert from 0->1 to 0->2
	vec2 zeroToTwo = zeroToOne * 2.0;

	// Convert from 0->2 to -1->+1 (clip space)
	vec2 clipSpace = zeroToTwo - 1.0;

	// Convert to WebGL space
	vec2 clipSpaceReal = clipSpace * vec2(1, -1);

	// Outputs
	gl_Position = vec4(clipSpaceReal, 0, 1);
	v_vertex_color = u_color;
}
