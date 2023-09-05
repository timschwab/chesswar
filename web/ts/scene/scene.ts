import map from "../../../common/map.ts";
import { gameRoot } from "../canvas/dom.ts";
import { CWScene } from "./CWScene.ts";

// Create scene
export const scene = new CWScene(gameRoot);

// Add background
const backgroundLayer = scene.createLayer(0);
backgroundLayer.addStaticRect(map.shape);
