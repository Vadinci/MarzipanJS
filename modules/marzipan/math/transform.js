import Vector2 from './vector2';
import Matrix3 from './matrix3';

//TODO some way to check if changes have been made in position, scale and rotation, and only recalculate the matrices 
//if necessary when they are asked for

let Transform = function (x, y, scaleX, scaleY, rotation) {
    this._position = new Vector2(x || 0, y || 0);
    this._scale = new Vector2(scaleX || 1, scaleY || 1); //TODO falsey
    this._rotation = rotation || 0;

    this._localTransform = Matrix3.identity();
    this._globalTransform = Matrix3.identity();

    this._parent = undefined;
    this._children = [];
};

Transform.prototype.preDraw = function (data) {
    this.recalculateMatrix();
    data.canvas.save();
    data.canvas.transform(
        this._globalTransform[0],
        this._globalTransform[3],
        this._globalTransform[1],
        this._globalTransform[4],
        this._globalTransform[2],
        this._globalTransform[5]
    );
};

Transform.prototype.postDraw = function (data) {
    data.canvas.restore();
};

//TODO a lot of creation an deletion going on here and in Matrix3.js
//try to push as much as possible on the stack and/or make functions in place or something?
Transform.prototype.recalculateMatrix = function () {
    Matrix3.reset(this._localTransform);
    this._localTransform = Matrix3.translate(this._localTransform, this._position.x, this._position.y);
    this._localTransform = Matrix3.rotate(this._localTransform, this._rotation);
    this._localTransform = Matrix3.scale(this._localTransform, this._scale.x, this._scale.y);

    this._globalTransform = Matrix3.clone(this._localTransform);
    if (this._parent) {
        //this bit is recursive until we hit a root transform
        this._parent.recalculateMatrix();
        this._globalTransform = Matrix3.multiply(this._globalTransform, this._parent._globalTransform);
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
    this._parent = other;
    if (other) other.addChild(this);
};

Transform.prototype.fromLocalPoint = function (x, y) {
    this.recalculateMatrix();

    return Matrix3.multiplyVector(this._globalTransform, {
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

    globalTransform : {
        get : function(){
            this.recalculateMatrix();
            return this._globalTransform;
        }
    }, localTransform : {
        get : function(){
            this.recalculateMatrix();
            return this._localTransform;
        }
    }
});

export default Transform;