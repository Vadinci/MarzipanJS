//TODO redo transform to just be a 3x2 matrix instead of maintaining a 3x3 matrix

import Vector2 from './vector2';
import Matrix3 from './matrix3';

//TODO some way to check if changes have been made in position, scale and rotation, and only recalculate the matrices 
//if necessary when they are asked for

class Transform {
    private _position: Vector2;
    private _scale: Vector2;
    private _rotation: number;

    private _localMatrix: Matrix3;
    private _globalMatrix: Matrix3;

    private _parent: Transform | null = null;
    private _children: Transform[] = [];

    constructor(x?: number, y?: number, scaleX?: number, scaleY?: number, rotation?: number) {
        this._position = new Vector2(x || 0, y || 0);
        this._scale = new Vector2(scaleX || 1, scaleY || 1); //TODO falsey
        this._rotation = rotation || 0;

        this._localMatrix = new Matrix3();
        this._globalMatrix = new Matrix3();
    };

    public preDraw(data: any): void {
        this.recalculateMatrix();
        data.canvas.save();
        data.canvas.transform(
            this._globalMatrix.mat[0],
            this._globalMatrix.mat[3],
            this._globalMatrix.mat[1],
            this._globalMatrix.mat[4],
            this._globalMatrix.mat[2],
            this._globalMatrix.mat[5]
        );
    };

    public postDraw(data: any): void {
        data.canvas.restore();
    };

    //TODO a lot of creation an deletion going on here and in Matrix3.js
    //try to push as much as possible on the stack and/or make functions in place or something?
    public recalculateMatrix(): void {
        this._localMatrix.identity();

        this._localMatrix = Matrix3.translate(this._localMatrix, this._position.x, this._position.y);
        this._localMatrix = Matrix3.rotate(this._localMatrix, this._rotation);
        this._localMatrix = Matrix3.scale(this._localMatrix, this._scale.x, this._scale.y);

        this._globalMatrix.copy(this._localMatrix);
        if (this._parent) {
            //this bit is recursive until we hit a root transform
            this._parent.recalculateMatrix();
            this._globalMatrix = Matrix3.multiply(this._globalMatrix, this._parent._globalMatrix);
        }

    };

    public addChild(other: Transform): void {
        var idx = this._children.indexOf(other);
        if (idx !== -1) return;
        this._children.push(other);
        other.setParent(this);
    };

    public removeChild(other: Transform): void {
        var idx = this._children.indexOf(other);
        if (idx === -1) return;
        this._children.splice(idx, 1);
        other.setParent(undefined);
    };

    public setParent(other: Transform): void {
        if (this._parent === other) return;
        if (this._parent) {
            this._parent.removeChild(this);
        }
        this._parent = other;
        if (other) other.addChild(this);
    };

    public fromLocalPoint(p: Vector2): Vector2 {
        this.recalculateMatrix();

        return Matrix3.multiplyVector(this._globalMatrix, p);
    };

    /**
     * FIXME there were issues with this function when rotation is involved
     * current implementation is taken from Bento. https://github.com/LuckyKat/Bento/blob/master/js/math/transformmatrix.js#L97
     * Why does the multiply vector with point not work? Is it because we shouldn't be using a 3x3 matrix?
     * is the implemenntation of inverse() or multiplyVector() broken?
     */
    public toLocalPoint = function (p: Vector2): Vector2 {
        this.recalculateMatrix();

        let m = this._globalMatrix;

        const a = 0;
        const b = 3;
        const c = 1;
        const d = 4;
        const tx = 2;
        const ty = 5;

        let x = p.x;
        let y = p.y;
        let determinant = 1 / (m[a] * m[d] - m[c] * m[b]);

        let rx = m[d] * x * determinant - m[c] * y * determinant + (m[ty] * m[c] - m[tx] * m[d]) * determinant;
        let ry = m[a] * y * determinant - m[b] * x * determinant + (-m[ty] * m[a] + m[tx] * m[b]) * determinant;

        return new Vector2(rx, ry);
    };

    public get position() { return this._position; };
    public get worldPosition() { return this.fromLocalPoint(Vector2.zero()); };

    public get scale() { return this._scale; };

    public get rotation() { return this._rotation; };
    public set rotation(v) { this._rotation = v; };

    public get globalMatrix() {
        this.recalculateMatrix();
        return this._globalMatrix;
    };

    public get localMatrix() {
        this.recalculateMatrix();
        return this._localMatrix;
    };

    public get parent() { return this._parent; };
    
    public get name() { return 'transform'; };
};

export default Transform;