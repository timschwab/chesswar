/*
**************************************************
***** THIS FILE IS GENERATED. DO NOT MODIFY. *****
**************************************************
*/

const contents = `// Fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

uniform sampler2D u_font;

varying vec2 v_tex_coord;
varying vec3 v_color;
 
void main() {
	// Get the color from the font texture
	vec4 glyphColor = texture2D(u_font, v_tex_coord);

	// Combine the alpha and the given color
	vec4 pointColor = glyphColor * vec4(v_color, 1.0);

	// Output
	gl_FragColor = pointColor;
}
`;

export default contents;
