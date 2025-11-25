// Fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

uniform sampler2D u_glyph_texture;

varying vec2 v_texture_coord;
varying vec3 v_vertex_color;
 
void main() {
	// Get the color from the font texture
	vec4 glyphColor = texture2D(u_glyph_texture, v_texture_coord);
	float glyphMask = (glyphColor.r + glyphColor.g + glyphColor.b) / 3.0;

	// Combine the alpha and the given color
	vec4 pointColor = vec4(v_vertex_color, glyphMask);

	// Output
	gl_FragColor = pointColor;
}
