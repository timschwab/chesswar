import playerVertexShader from "./glsl-generated/playerVertexShader.ts";
import playerFragmentShader from "./glsl-generated/playerFragmentShader.ts";
import { Circle } from "../../../../common/shapes/Circle.ts";
import { ZeroPoint } from "../../../../common/shapes/Zero.ts";
import { WebglRenderer } from "../WebglRenderer.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { ClientPlayer } from "../../game-logic/ClientPlayer.ts";
import { bindToScreen } from "../../core/screen.ts";
import { TeamName } from "../../../../common/data-types/base.ts";
import { rensets } from "../../../../common/settings.ts";


const SCREEN = "u_screen";
const CAMERA_CENTER = "u_camera_center";
const COLOR = "u_color";
const SCALE = "u_scale";
const STRUCTURE_CENTER = "u_structure_center";
const VERTEX = "a_vertex";

// A class for rendering players
export class PlayerRenderer {
	private readonly renderer: WebglRenderer;

	constructor() {
		// Prepare the player rendering data
		const circleData = new Circle(ZeroPoint, 1)
			.toTriangles()
			.flatMap(triangle => [triangle.v1, triangle.v2, triangle.v3]);
		const attributeDataMap = new Map([[VERTEX, circleData]]);

		// Create the renderer
		this.renderer = new WebglRenderer(
			playerVertexShader, playerFragmentShader,
			[SCALE], [SCREEN, CAMERA_CENTER, STRUCTURE_CENTER], [COLOR],
			attributeDataMap
		);

		// Bind the screen size to the screen uniform
		bindToScreen(screenValue => this.renderer.setUniformPoint(SCREEN, screenValue.rightBottom));
	}

	render(camera: Point, players: ClientPlayer[]) {
		// Set the camera once per render
		this.renderer.setUniformPoint(CAMERA_CENTER, camera);

		// Group the players into team/size buckets
		const bucketedPlayers = players.reduce((acc, cur) => {
			let sizeMap = acc.get(cur.team);
			if (sizeMap === undefined) {
				sizeMap = new Map();
				acc.set(cur.team, sizeMap);
			}

			let playerList = sizeMap.get(cur.position.radius);
			if (playerList === undefined) {
				playerList = [];
				sizeMap.set(cur.position.radius, playerList);
			}
			playerList.push(cur.position.center);

			return acc;
		}, new Map<TeamName, Map<number, Point[]>>());

		bucketedPlayers.entries().forEach(([teamName, roleMap]) => {
			// Set the color once per team
			this.renderer.setUniformColor(COLOR, rensets.players.teamColor[teamName]);
			roleMap.entries().forEach(([playerSize, playerList]) => {
				// Set the size once per team/size tuple
				this.renderer.setUniformValue(SCALE, playerSize);
				playerList.forEach(center => {
					// Set the center for every player
					this.renderer.setUniformPoint(STRUCTURE_CENTER, center);
					// Draw
					this.renderer.draw();
				});
			});
		});
	}
}
