// Fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

varying vec3 v_vertex_color;
 
void main() {
	// Set the final color to what was passed in
	gl_FragColor = vec4(v_vertex_color, 1.0);
}
