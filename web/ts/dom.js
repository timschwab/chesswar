// Get all the important dom elements
let ids = ["canvas"];

let elements = Object.fromEntries(
	ids.map((id) => [id, document.getElementById(id)])
);

export default elements;
