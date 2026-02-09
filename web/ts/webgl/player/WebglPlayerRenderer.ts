import playerVertexShader from "./glsl-generated/playerVertexShader.ts";
import playerFragmentShader from "./glsl-generated/playerFragmentShader.ts";
import { Circle } from "../../../../common/shapes/Circle.ts";
import { ZeroPoint } from "../../../../common/shapes/Zero.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { ClientPlayer } from "../../game-logic/ClientPlayer.ts";
import { PlayerRole } from "../../../../common/data-types/base.ts";
import { rensets } from "../../../../common/settings.ts";
import { CWScreen } from "../../core/CWScreen.ts";
import { WebglInterface } from "../WebglInterface.ts";

const SNAP_TO_EDGE = "u_snap_to_edge";
const SCREEN = "u_screen";
const CAMERA_CENTER = "u_camera_center";
const COLOR = "u_color";
const SCALE = "u_scale";
const PLAYER_CENTER = "u_player_center";

const VERTEX = "a_vertex";

// A class for rendering players
export class WebglPlayerRenderer {
	private readonly renderer: WebglRenderer;

	constructor(webgl: WebglInterface, screen: CWScreen) {
		// Prepare the player rendering data
		const circleData = new Circle(ZeroPoint, 1)
			.toTriangles()
			.flatMap(triangle => [triangle.v1, triangle.v2, triangle.v3]);
		const attributePointData = new Map([[VERTEX, circleData]]);

		// Create the renderer
		this.renderer = new WebglRenderer(webgl, screen, {
			shaderSource: {
				vertex: playerVertexShader,
				fragment: playerFragmentShader
			},
			uniformNames: {
				screen: SCREEN,
				values: [SNAP_TO_EDGE, SCALE],
				points: [CAMERA_CENTER, PLAYER_CENTER],
				colors: [COLOR]
			},
			attributeData: {
				points: attributePointData
			}
		});
	}

	render(selfPlayer: ClientPlayer, players: ClientPlayer[]) {
		// Prepare webgl
		this.renderer.prep();

		// Set the camera once per render
		this.renderer.setUniformPoint(CAMERA_CENTER, selfPlayer.position.center);

		// Render all the players
		players.forEach(player => {
			// Set all the uniforms
			this.renderer.setUniformColor(COLOR, rensets.players.teamColor[player.team]);
			this.renderer.setUniformValue(SCALE, player.position.radius);
			this.renderer.setUniformPoint(PLAYER_CENTER, player.position.center);
			if (selfPlayer.role === PlayerRole.TANK && [PlayerRole.SOLDIER, PlayerRole.TANK].includes(player.role)) {
				this.renderer.setUniformValue(SNAP_TO_EDGE, 1);
			} else {
				this.renderer.setUniformValue(SNAP_TO_EDGE, 0);
			}

			// Draw
			this.renderer.draw();
		});
	}
}
