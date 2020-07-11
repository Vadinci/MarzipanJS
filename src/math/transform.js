import Vector2 from './vector2';
import Matrix3 from './matrix3';

//TODO some way to check if changes have been made in position, scale and rotation, and only recalculate the matrices 
//if necessary when they are asked for

let Transform = function (x, y, scaleX, scaleY, rotation) {
    this._position = new Vector2(x || 0, y || 0);
    this._scale = new Vector2(scaleX || 1, scaleY || 1); //TODO falsey
    this._rotation = rotation || 0;

    this._localMatrix = Matrix3.identity();
    this._globalMatrix = Matrix3.identity();

    this._parent = undefined;
    this._children = [];
};

Transform.prototype.preDraw = function (data) {
    this.recalculateMatrix();
    data.canvas.save();
    data.canvas.transform(
        this._globalMatrix[0],
        this._globalMatrix[3],
        this._globalMatrix[1],
        this._globalMatrix[4],
        this._globalMatrix[2],
        this._globalMatrix[5]
    );
};

Transform.prototype.postDraw = function (data) {
    data.canvas.restore();
};

//TODO a lot of creation an deletion going on here and in Matrix3.js
//try to push as much as possible on the stack and/or make functions in place or something?
Transform.prototype.recalculateMatrix = function () {
    Matrix3.reset(this._localMatrix);
    this._localMatrix = Matrix3.translate(this._localMatrix, this._position.x, this._position.y);
    this._localMatrix = Matrix3.rotate(this._localMatrix, this._rotation);
    this._localMatrix = Matrix3.scale(this._localMatrix, this._scale.x, this._scale.y);

    this._globalMatrix = Matrix3.clone(this._localMatrix);
    if (this._parent) {
        //this bit is recursive until we hit a root transform
        this._parent.recalculateMatrix();
        this._globalMatrix = Matrix3.multiply(this._globalMatrix, this._parent._globalMatrix);
    }
};

Transform.prototype.addChild = function (other) {
    var idx = this._children.indexOf(other);
    if (idx !== -1) return;
    this._children.push(other);
    other.setParent(this);
};

Transform.prototype.removeChild = function (other) {
    var idx = this._children.indexOf(other);
    if (idx === -1) return;
    this._children.splice(idx, 1);
    other.setParent(undefined);
};

Transform.prototype.setParent = function (other) {
    if (this._parent === other) return;
    if (this._parent){
        this._parent.removeChild(this);
    }
    this._parent = other;
    if (other) other.addChild(this);
};

Transform.prototype.fromLocalPoint = function (x, y) {
    this.recalculateMatrix();

    return Matrix3.multiplyVector(this._globalMatrix, {
        x: x,
        y: y
    });
};

Object.defineProperties(Transform.prototype, {
    name: {
        writable: false,
        value: 'transform'
    },
    parent: {
        get: function () { return this._parent },
        set: function (v) {
            this.setParent(v);
        }
    },
    position: {
        get: function () { return this._position; }
    },
    worldPosition: {
        get: function () { return this.fromLocalPoint(0, 0); }
    },
    scale: {
        get: function () { return this._scale; }
    },
    rotation: {
        get: function () { return this._rotation; },
        set: function (v) {
            this._rotation = v;
        }
    },

    globalMatrix: {
        get: function () {
            this.recalculateMatrix();
            return this._globalMatrix;
        }
    },
    localMatrix: {
        get: function () {
            this.recalculateMatrix();
            return this._localMatrix;
        }
    }
});

export default Transform;