import map from "../../../common/map.ts";
import { canvasObject } from "../canvas/canvas.ts";
import { CWScene } from "./CWScene.ts";

// Create scene
export const scene = new CWScene(canvasObject.FIELD_BACKGROUND);

// Add background
scene.addStaticRect(map.shape);
