uniform float u_snap_to_edge; // 0.0 or 1.0
uniform float u_scale;
uniform vec2 u_screen;
uniform vec2 u_camera_center;
uniform vec2 u_player_center;
uniform vec3 u_color;

attribute vec2 a_vertex;

varying vec3 v_vertex_color;

void main() {
	// Initial computations
	float isNotSnapped = 1.0 - u_snap_to_edge;
	vec2 cameraLeftTop = u_camera_center - (u_screen/2.0);
	vec2 cameraRightBottom = u_camera_center + (u_screen/2.0);

	// Compute the snap-adjusted player position
	vec2 maybeSnapAdjusted = min(max(cameraLeftTop, u_player_center), cameraRightBottom);
	vec2 snapAdjusted = (u_player_center * isNotSnapped) + (maybeSnapAdjusted * u_snap_to_edge);

	// Compute the camera-adjusted player position
	vec2 cameraAdjustedPlayer = snapAdjusted - cameraLeftTop;

	// Find the final position
	vec2 scaleAdjusted = a_vertex * u_scale;
	vec2 finalPosition = scaleAdjusted + cameraAdjustedPlayer;

	// Convert from 0->n to 0->1
	vec2 zeroToOne = finalPosition / u_screen;

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
