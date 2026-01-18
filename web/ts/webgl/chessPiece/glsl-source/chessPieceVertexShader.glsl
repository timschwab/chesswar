uniform vec2 u_screen;
uniform vec2 u_left_top;
uniform vec2 u_right_bot;

uniform vec3 u_light_color;
uniform vec3 u_dark_color;

attribute vec2 a_vertex; // [(0, 0), (0, 1), (1, 0), (1, 1)]

varying vec2 v_vertex_location;
varying vec3 v_light_color;
varying vec3 v_dark_color;

void main() {
	// Compute the position
	vec2 computedRightBot = u_right_bot * a_vertex; // if 0 then 0, if 1 then u_right_bot
	vec2 computedLeftTop =  u_left_top * (1.0 - a_vertex); // if 0 then u_left_top, if 1 then 0
	vec2 computedPosition = computedLeftTop + computedRightBot; // if 0 then u_left_top, if 1 then u_right_bot

	// Convert from 0->n to 0->1
	vec2 zeroToOne = computedPosition / u_screen;

	// Convert from 0->1 to 0->2
	vec2 zeroToTwo = zeroToOne * 2.0;

	// Convert from 0->2 to -1->+1 (clip space)
	vec2 clipSpace = zeroToTwo - 1.0;

	// Convert to WebGL space (flip the Y)
	vec2 clipSpaceReal = clipSpace * vec2(1, -1);

	// Outputs
	gl_Position = vec4(clipSpaceReal, 0, 1);
	v_vertex_location = a_vertex;
	v_light_color = u_light_color;
	v_dark_color = u_dark_color;
}
