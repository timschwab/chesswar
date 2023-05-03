// Get all the important dom elements
const ids = ["canvas"];

const elements = Object.fromEntries(
	ids.map((id) => [id, window.document.getElementById(id)])
);

export default elements;
