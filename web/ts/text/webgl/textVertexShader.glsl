attribute vec2 a_vertex;

varying vec3 v_vertex_color;

void main() {
	// Outputs
	gl_Position = vec4(a_vertex, 0, 1);
	v_vertex_color = a_color;
}
