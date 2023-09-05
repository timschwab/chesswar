import { objectMap } from "../../../common/typescript-utils.ts";
import { CWCanvas } from "./CWCanvas.ts";
import { domObject } from "./dom.ts";

export const canvasObject = objectMap(domObject, (_key, value, _index) => new CWCanvas(value));

