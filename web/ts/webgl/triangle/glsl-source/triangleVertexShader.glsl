uniform vec2 u_screen;
uniform vec2 u_v1;
uniform vec2 u_v2;
uniform vec2 u_v3;
uniform vec3 u_color;

attribute vec2 a_vertex; // [(1, 1), (1, 0), (0, 1)]

varying vec3 v_vertex_color;

void main() {
	// Compute which vertex we are
	float v1or2 = a_vertex.x;
	float v1or3 = a_vertex.y;
	float v2or3 = 2.0 - (a_vertex.x + a_vertex.y);

	float isV1 = v1or2 * v1or3;
	float isV2 = v1or2 * v2or3;
	float isV3 = v1or3 * v2or3;

	vec2 computedV1 = u_v1 * isV1;
	vec2 computedV2 = u_v2 * isV2;
	vec2 computedV3 = u_v3 * isV3;

	vec2 computedPosition = computedV1 + computedV2 + computedV3;

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
	v_vertex_color = u_color;
}
