// Get all the important dom elements
const field = window.document.getElementById("field") as HTMLCanvasElement;
if (field == null) {
	throw "Could not find canvas";
}

const ui = window.document.getElementById("ui") as HTMLCanvasElement;
if (ui == null) {
	throw "Could not find canvas";
}

export default {
	field,
	ui
};
