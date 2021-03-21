export class Vector2 {
	public x: number = 0;
	public y: number = 0;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	};

	//#region Creation
	//these functions are intended for creating a new vector from scratch
	public static zero(): Vector2 {
		return new Vector2(0, 0);
	};

	public static fromPolar(angle: number, dist: number): Vector2 {
		return new Vector2(
			Math.cos(angle) * dist,
			Math.sin(angle) * dist
		);
	};
	//#endregion


	//#region Modification
	//all these functions directly modify the calling function
	public add(other: Vector2): Vector2 {
		this.x += other.x;
		this.y += other.y;
		return this;
	};

	public subtract(other: Vector2): Vector2 {
		this.x -= other.x;
		this.y -= other.y;
		return this;
	};
	//TODO work out aliasing
	//public sub = public subtract;

	public multiply(other: Vector2): Vector2 {
		this.x *= other.x;
		this.y *= other.y;
		return this;
	};

	public multiplyScalar(v: number): Vector2 {
		this.x *= v;
		this.y *= v;
		return this;
	};

	public divide(other: Vector2): Vector2 {
		this.x /= other.x;
		this.y /= other.y;
		return this;
	};

	public divideScalar(v: number): Vector2 {
		this.x /= v;
		this.y /= v;
		return this;
	};

	public setTo(other: Vector2): Vector2 {
		this.x = other.x;
		this.y = other.y;
		return this;
	};
	//TODO work out aliasing
	//public copy = public setTo;

	public set(x: number, y: number): Vector2 {
		this.x = x;
		this.y = y;
		return this;
	};

	public normalize(): Vector2 {
		let magnitude = this.sqrMagnitude();
		if (magnitude === 0) {
			this.set(0, 0);
			return this;
		}
		magnitude = Math.sqrt(magnitude);
		this.divideScalar(magnitude);
		return this;
	};
	//#endregion


	public dot(other): number {
		return this.x * other.x + this.y * other.y;
	};

	public cross(other): number {
		return this.x * other.y - this.y * other.x;
	};

	public sqrMagnitude(): number {
		return this.dot(this);
	};

	public magnitude(): number {
		return Math.sqrt(this.sqrMagnitude());
	};

	public angle(): number {
		return Math.atan2(this.y, this.x);
	};

	public clone(): Vector2 {
		return new Vector2(this.x, this.y);
	};

	public toString(): string {
		return `(${this.x},${this.y})`;
	};


	//#region Resulting
	//these functions create a new vector (or scalar where applicable) based on the input, leaving the old vector intact
	public static add(a: Vector2, b: Vector2): Vector2 {
		return new Vector2(a.x + b.x, a.y + b.y);
	};

	public static subtract(a: Vector2, b: Vector2): Vector2 {
		return new Vector2(a.x - b.x, a.y - b.y);
	};
	//TODO work out aliasing
	//public static sub = public static subtract;

	public static multiply(a: Vector2, b: Vector2): Vector2 {
		return new Vector2(a.x * b.x, a.y * b.y);
	};

	public static multiplyScalar(a: Vector2, v: number): Vector2 {
		return new Vector2(a.x * v, a.y * v);
	};

	public static divide(a: Vector2, b: Vector2): Vector2 {
		return new Vector2(a.x / b.x, a.y / b.y);
	};

	public static divideScalar(a: Vector2, v: number): Vector2 {
		return new Vector2(a.x / v, a.y / v);
	};

	public static normalize(a: Vector2): Vector2 {
		return a.clone().normalize();
	};

	public static clone(other: Vector2): Vector2 {
		return new Vector2(other.x, other.y);
	};

	public static dot(a: Vector2, b: Vector2): number {
		return a.x * b.x + a.y * b.y;
	};

	public static cross(a: Vector2, b: Vector2): number {
		return a.x * b.y - a.y * b.x;
	};
	//#endregion
};