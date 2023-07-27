import { objectMap } from "../../../common/typescript-utils.ts";
import { CWCanvas } from "./CWCanvas.ts";
import dom from "./dom.ts";

const canvasObject = objectMap(dom, (_key, value, _index) => new CWCanvas(value));
export default canvasObject;
