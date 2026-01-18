// Fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision".
precision mediump float;

varying vec2 v_vertex_location;
varying vec3 v_light_color;
varying vec3 v_dark_color;
 
void main() {
	// Create an 8x8 checkerboard, alternating between the light and dark colors
	gl_FragColor = vec4(v_vertex_color, 1.0);
}
