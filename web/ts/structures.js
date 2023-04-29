function point(x, y) {
	return {
		x,
		y
	};
}

function rect(topLeft, bottomRight) {
	return {
		topLeft,
		bottomRight,
		width: bottomRight.x - topLeft.x,
		height: bottomRight.y - topLeft.y
	};
}

function circle(center, radius) {
	return {
		center,
		radius
	};
}

let api = {
	point,
	rect,
	circle
};

export default api;
