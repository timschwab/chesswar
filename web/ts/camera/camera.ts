import map from "../../../common/map.ts";
import canvas from "../canvas/canvas.ts";
import { CWCamera } from "./CWCamera.ts";

// Construct camera
export const camera = new CWCamera(canvas.FIELD_BACKGROUND);

// Add the map to the camera
camera.addStaticRect(map.rect);
