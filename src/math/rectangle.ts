//TODO needs more functionality

import Vector2 from "./vector2";

class Rectangle {
	public x: number;
	public y: number;
	public width: number;
	public height: number;

	constructor(x = 0, y = 0, width = 1, height = 1) {
		this.set(x, y, width, height);
	};

	public set(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	};

	public copy(other: Rectangle) {
		this.set(other.x, other.y, other.width, other.height);
	};

	public getCenter(): Vector2 {
		let center = new Vector2();
		center.x = this.x + this.width / 2;
		center.y = this.y + this.height / 2;

		return center;
	};

	public enclose(point: Vector2): Rectangle {
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

		return this;
	};

	public contains(point: Vector2): boolean {
		if (point.x < this.x) return false;
		if (point.x > this.x + this.width) return false;
		if (point.y < this.y) return false;
		if (point.y > this.y + this.height) return false;

		return true;
	};

	public toString(): string {
		return `({this.x}, {this.y}), ({this.x+this.width}, {this.y + this.height})`;
	};
};

export default Rectangle;