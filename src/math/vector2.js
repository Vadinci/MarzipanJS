let Vector2 = function (x, y) {
	this.x = x || 0;
	this.y = y || 0;
};

//#region Creation
//these functions are intended for creating a new vector from scratch
Vector2.zero = function () {
	return new Vector2(0, 0);
};

Vector2.fromPolar = function (angle, dist) {
	return new Vector2(
		Math.cos(angle) * dist,
		Math.sin(angle) * dist
	);
};
//#endregion

//#region Modification
//all these functions directly modify the calling function
Vector2.prototype.add = function (other) {
	this.x += other.x;
	this.y += other.y;
	return this;
};

Vector2.prototype.subtract = function (other) {
	this.x -= other.x;
	this.y -= other.y;
	return this;
};
Vector2.prototype.sub = Vector2.prototype.subtract;

Vector2.prototype.multiply = function (other) {
	this.x *= other.x;
	this.y *= other.y;
	return this;
};

Vector2.prototype.multiplyScalar = function (v) {
	this.x *= v;
	this.y *= v;
	return this;
};

Vector2.prototype.divide = function (other) {
	this.x /= other.x;
	this.y /= other.y;
	return this;
};

Vector2.prototype.divideScalar = function (v) {
	this.x /= v;
	this.y /= v;
	return this;
};

Vector2.prototype.setTo = function (other) {
	this.x = other.x;
	this.y = other.y;
	return this;
};
Vector2.prototype.copy = Vector2.prototype.setTo;

Vector2.prototype.set = function (x, y) {
	this.x = x;
	this.y = y;
	return this;
};

Vector2.prototype.normalize = function () {
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

Vector2.prototype.dot = function (other) {
	return this.x * other.x + this.y * other.y;
};

Vector2.prototype.sqrMagnitude = function () {
	return this.dot(this);
};

Vector2.prototype.magnitude = function () {
	return Math.sqrt(this.sqrMagnitude());
};

Vector2.prototype.angle = function () {
	return Math.atan2(this.y, this.x);
};

Vector2.prototype.clone = function () {
	return new Vector2(this.x, this.y);
};

//#region Resulting
//these functions create a new vector (or scalar where applicable) based on the input, leaving the old vector intact
Vector2.add = function(a, b){
	return new Vector2(a.x + b.x, a.y + b.y);
};

Vector2.subtract = function(a, b){
	return new Vector2(a.x - b.x, a.y - b.y);
};
Vector2.sub = Vector2.subtract;

Vector2.multiply = function(a, b){
	return new Vector2(a.x * b.x, a.y * b.y);
};

Vector2.multiplyScalar = function(a, v){
	return new Vector2(a.x * v, a.y * v);
};

Vector2.divide = function(a, b){
	return new Vector2(a.x / b.x, a.y / b.y);
};

Vector2.divideScalar = function(a, v){
	return new Vector2(a.x / v, a.y / v);
};

Vector2.normalize = function(a){
	return a.clone().normalize();
};

Vector2.copy = function(other){
	return new Vector2(other.x, other.y);
};
//#endregion

export default Vector2;