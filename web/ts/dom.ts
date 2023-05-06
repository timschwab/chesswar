// Get all the important dom elements
const canvas = window.document.getElementById("canvas") as HTMLCanvasElement;
if (canvas == null) {
	throw "Could not find canvas";
}

export default {
	canvas
};
