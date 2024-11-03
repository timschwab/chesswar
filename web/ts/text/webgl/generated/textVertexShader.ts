/*
**************************************************
***** THIS FILE IS GENERATED. DO NOT MODIFY. *****
**************************************************
*/

const contents = `uniform vec2 u_screen;

attribute vec2 a_screen_position;
attribute vec2 a_tex_position;

varying vec2 v_tex_coord;

void main() {
	// Convert from 0->n to 0->1
	vec2 zeroToOne = a_screen_position / u_screen;

	// Convert from 0->1 to 0->2
	vec2 zeroToTwo = zeroToOne * 2.0;

	// Convert from 0->2 to -1->+1 (clip space)
	vec2 clipSpace = zeroToTwo - 1.0;

	// Convert to WebGL space
	vec2 clipSpaceReal = clipSpace * vec2(1, -1);

	// Outputs
	v_tex_coord = a_tex_position;
	gl_Position = vec4(clipSpaceReal, 0, 1);
}
`;

export default contents;
