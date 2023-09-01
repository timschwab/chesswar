import { objectFromEntries } from "../../../common/typescript-utils.ts";
import { CanvasNameList, CanvasNameType } from "./CanvasName.ts";

const gameRoot = window.document.getElementById("game");

function createCanvasTuple(name: CanvasNameType, index: number): readonly [CanvasNameType, HTMLCanvasElement] {
	if (gameRoot == null) {
		throw "Could not find game div";
	}

	const canvas = document.createElement("canvas");
	canvas.style.zIndex = String(index);
	canvas.id = String(name);
	gameRoot.appendChild(canvas);
	return [name, canvas] as const;
}

const entries = CanvasNameList.map(createCanvasTuple);
const domObject = objectFromEntries(entries);
export default domObject;
