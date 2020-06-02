import Vector2 from "./vector2";

let Rectangle = function (x, y, width, height) {
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
};

//TODO functionality ;)

Rectangle.prototype.set = function (other) {
	this.x = other.x;
	this.y = other.y;
	this.width = other.width;
	this.height = other.height;
};

Rectangle.prototype.getCenter = function (point) {
	let center = new Vector2();
	center.x = this.x + this.width / 2;
	center.y = this.y + this.height / 2;

	return center;
};

Rectangle.prototype.enclose = function (point) {
	if (point.x < this.x) {
		this.width += this.x - point.x;
		this.x = point.x;
	} else if (point.x > this.x + this.width) {
		this.width += point.x - (this.x + this.width);
	}

	if (point.y < this.y) {
		this.height += this.y - point.y;
		this.y = point.y;
	} else if (point.y > this.y + this.height) {
		this.height += point.y - (this.y + this.height);
	}

	console.log(this);

	return this;
};

Rectangle.prototype.toString = function () {
	return `({this.x}, {this.y}), ({this.x+this.width}, {this.y + this.height})`;
};

export default Rectangle;