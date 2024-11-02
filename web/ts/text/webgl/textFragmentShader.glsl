// Fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

uniform sampler2D u_font;

varying vec2 v_tex_coord;
 
void main() {
	// Get the color from the font texture
	gl_FragColor = texture2D(u_font, v_tex_coord);
}
