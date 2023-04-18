let width = 5000;
let height = 3000;

let middle = {
	x: width / 2,
	y: height / 2
};

let deathRects = [
	{
		topLeft: {
			x: middle.x - 100,
			y: 0
		},
		bottomRight: {
			x: middle.x + 100,
			y: 500
		}
	}
];

let map = {
	width,
	height,
	start: middle,
	deathRects
};

export default map;
