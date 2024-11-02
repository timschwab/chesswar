attribute vec2 a_screen_position;
attribute vec2 a_tex_position;

varying vec2 v_tex_coord;

void main() {
	// Outputs
	v_tex_coord = a_tex_position;
	gl_Position = vec4(a_screen_position, 0, 1);
}
