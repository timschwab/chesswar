// Overall settings
uniform vec2 u_screen;
uniform vec2 u_glyph_bounding_box;
uniform float u_glyph_count;

// Settings per text
uniform vec2 u_left_top;
uniform float u_scale;
uniform vec3 u_color;

// Settings per glyph
uniform float u_grapheme_position;
uniform float u_glyph_index;

// Rectangle data
// [(0, 0), (0, 1), (1, 0),
//          (0, 1), (1, 0), (1, 1)]
attribute vec2 a_vertex;

// Outputs
varying vec2 v_texture_coord;
varying vec3 v_vertex_color;

void main() {
	/***** Get screen coords *****/
	// Find the scale-adjusted glyph bounding box
	vec2 scaledGlyphBoundingBox = u_glyph_bounding_box * u_scale;

	// Move according to the grapheme position and vertex
	vec2 positionInText = vec2(
		scaledGlyphBoundingBox.x * (a_vertex.x + u_grapheme_position),
		scaledGlyphBoundingBox.y * (a_vertex.y)
	);

	// Find the translated position
	vec2 translatedPosition = positionInText + u_left_top;

	// Convert from 0->n to 0->1
	vec2 zeroToOne = translatedPosition / u_screen;

	// Convert from 0->1 to 0->2
	vec2 zeroToTwo = zeroToOne * 2.0;

	// Convert from 0->2 to -1->+1 (clip space)
	vec2 clipSpace = zeroToTwo - 1.0;

	// Convert to WebGL space (flip the Y)
	vec2 clipSpaceReal = clipSpace * vec2(1, -1);

	/***** Get texture coords *****/
	float textureXPosition = (u_glyph_index + a_vertex.x) / u_glyph_count;
	float textureYPosition = a_vertex.y;
	vec2 texturePosition = vec2(textureXPosition, textureYPosition);

	/***** Outputs *****/
	v_texture_coord = texturePosition;
	v_vertex_color = u_color;
	gl_Position = vec4(clipSpaceReal, 0, 1);
}
