import { Color } from "../../../common/Color.ts";
import { Point } from "../../../common/shapes/Point.ts";

export interface WebGlRendererSettings {
	shaderSource: {
		vertex: string,
		fragment: string
	},
	uniformNames: {
		screen?: string,
		values?: string[],
		points?: string[],
		colors?: string[]
	},
	attributeData: {
		values?: Map<string, number[]>,
		points?: Map<string, Point[]>,
		colors?: Map<string, Color[]>
	}
}

export interface StrictWebGlRendererSettings {
	shaderSource: {
		vertex: string,
		fragment: string
	},
	uniformNames: {
		screen: string | null,
		values: string[],
		points: string[],
		colors: string[]
	},
	attributeData: {
		values: Map<string, number[]>,
		points: Map<string, Point[]>,
		colors: Map<string, Color[]>
	}
}

export function makeStrict(settings: WebGlRendererSettings): StrictWebGlRendererSettings {
	return {
		shaderSource: {
			vertex: settings.shaderSource.vertex,
			fragment: settings.shaderSource.fragment
		},
		uniformNames: {
			screen: settings.uniformNames.screen || null,
			values: settings.uniformNames.values || [],
			points: settings.uniformNames.points || [],
			colors: settings.uniformNames.colors || []
		},
		attributeData: {
			values: settings.attributeData.values || new Map(),
			points: settings.attributeData.points || new Map(),
			colors: settings.attributeData.colors || new Map()
		}
	};
}
