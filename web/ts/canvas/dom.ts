import { objectFromEntries, tuple } from "../../../common/typescript-utils.ts";
import { CanvasNameList, CanvasNameType } from "./CanvasName.ts";

const gameRoot = window.document.getElementById("game");

function createCanvasTuple(name: CanvasNameType, index: number) {
	if (gameRoot == null) {
		throw "Could not find game div";
	}

	const canvas = document.createElement("canvas");
	canvas.style.zIndex = String(index);
	canvas.id = String(name);
	gameRoot.appendChild(canvas);
	return tuple(name, canvas);
}

const entries = CanvasNameList.map(createCanvasTuple);
const domObject = objectFromEntries(entries);
export default domObject;
