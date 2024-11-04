uniform vec2 u_glyph_bounding_box;
uniform vec2 u_screen;
uniform float u_tex_length;

attribute float a_scale;
attribute vec2 a_text_top_left;
attribute float a_glyph_index;
attribute vec2 a_glyph_vertex;
attribute vec2 a_tex_index;

varying vec2 v_tex_coord;

void main() {
	/***** Get screen coords *****/
	// Adjust the size of the glyph bounding box
	vec2 adjustedGlyphBoundingBox = u_glyph_bounding_box * a_scale;

	// Find the scaled glyph vertex
	vec2 scaledVertex = a_glyph_vertex * adjustedGlyphBoundingBox;

	// Offset by glyph index
	float glyphLeftOffset = adjustedGlyphBoundingBox.x * a_glyph_index;
	vec2 indexOffsetVertex = vec2(scaledVertex.x+glyphLeftOffset, scaledVertex.y);

	// Offset by text top left
	vec2 leftTopOffsetVertex = indexOffsetVertex + a_text_top_left;

	// Convert from 0->n to 0->1
	vec2 zeroToOne = leftTopOffsetVertex / u_screen;

	// Convert from 0->1 to 0->2
	vec2 zeroToTwo = zeroToOne * 2.0;

	// Convert from 0->2 to -1->+1 (clip space)
	vec2 clipSpace = zeroToTwo - 1.0;

	// Convert to WebGL space
	vec2 clipSpaceReal = clipSpace * vec2(1, -1);

	/***** Get texture coords *****/
	// Convert from glyph index to texture position
	vec2 texPosition = vec2(a_tex_index.x/u_tex_length, a_tex_index.y);

	// Outputs
	v_tex_coord = texPosition;
	gl_Position = vec4(clipSpaceReal, 0, 1);
}
