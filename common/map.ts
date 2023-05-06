const width = 5000;
const height = 3000;

const middle = {
	x: width / 2,
	y: height / 2
};

const deathRects = [
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

const map = {
	width,
	height,
	start: middle,
	deathRects
};

export type ChesswarMap = typeof map;

export default map;
