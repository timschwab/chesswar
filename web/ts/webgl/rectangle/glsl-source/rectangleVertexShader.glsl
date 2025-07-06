uniform vec2 u_screen;
uniform vec2 u_camera_center;
uniform vec2 u_left_top;
uniform vec2 u_right_bot;
uniform vec3 u_color;

attribute vec2 a_vertex; // [(0, 0), (1, 1)]

varying vec3 v_vertex_color;

void main() {
	// Compute the position
	vec2 computedRightBot = a_vertex * u_right_bot; // if (0, 0) then (0, 0), if (1, 1) then u_right_bot
	vec2 computedLeftTop = (vec2(1, 1) - a_vertex) * u_left_top // if (0, 0) then u_left_top, if (1, 1) then (0, 0)
	vec2 computedPosition = computedLeftTop + computedRightBot; // if (0, 0) then u_left_top, if (1, 1) then u_right_bot

	// Find the camera-adjusted position
	vec2 cameraTopLeft = u_camera_center - (u_screen/2.0);
	vec2 cameraAdjusted = computedPosition - cameraTopLeft;

	// Convert from 0->n to 0->1
	vec2 zeroToOne = cameraAdjusted / u_screen;

	// Convert from 0->1 to 0->2
	vec2 zeroToTwo = zeroToOne * 2.0;

	// Convert from 0->2 to -1->+1 (clip space)
	vec2 clipSpace = zeroToTwo - 1.0;

	// Convert to WebGL space (flip the Y)
	vec2 clipSpaceReal = clipSpace * vec2(1, -1);

	// Outputs
	gl_Position = vec4(clipSpaceReal, 0, 1);
	v_vertex_color = u_color;
}
