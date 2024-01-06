uniform vec2 u_screen;
uniform vec2 u_camera_center;

attribute float a_scale;
attribute vec2 a_structure_center;
attribute vec2 a_vertex;
attribute vec3 a_color;

varying vec3 v_vertex_color;

void main() {
	// Find the scale-adjusted position
	vec2 scaleAdjusted = a_vertex * a_scale;

	// Find the structure-adjusted position
	vec2 structureAdjusted = scaleAdjusted + a_structure_center;

	// Find the camera-adjusted position
	vec2 cameraTopLeft = u_camera_center - (u_screen/2.0);
	vec2 cameraAdjusted = structureAdjusted - cameraTopLeft;

	// Convert from 0->n to 0->1
	vec2 zeroToOne = cameraAdjusted / u_screen;

	// Convert from 0->1 to 0->2
	vec2 zeroToTwo = zeroToOne * 2.0;

	// Convert from 0->2 to -1->+1 (clip space)
	vec2 clipSpace = zeroToTwo - 1.0;

	// Convert to WebGL space
	vec2 clipSpaceReal = clipSpace * vec2(1, -1);

	// Outputs
	gl_Position = vec4(clipSpaceReal, 0, 1);
	v_vertex_color = a_color;
}
