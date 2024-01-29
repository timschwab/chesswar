import { TriangleVerticesArray } from "../../../common/shapes/Triangle.ts";

export const symbolMappings: Record<string, TriangleVerticesArray[]> = {
	" ": [
		// Empty of course!
	],
	".": [
		[0.2, 1, 0.2, 0.9, 0.3, 1],
		[        0.2, 0.9, 0.3, 1, 0.3, 0.9]
	],
	"|": [
		[0.4, -0.3, 0.6, -0.3, 0.4, 1.3],
		[           0.6, -0.3, 0.4, 1.3, 0.6, 1.3],
	]
};
