//TODO read up on matrices and go over this file again :) 

import { Vector2 } from "./vector2";

const C00 = 0;
const C10 = 1;
const C20 = 2;

const C01 = 3;
const C11 = 4;
const C21 = 5;

const C02 = 6;
const C12 = 7;
const C22 = 8;

export class Matrix3 {
    public mat: Float32Array = new Float32Array(9);

    constructor() {
        this.identity();
    };

    public identity() {
        this.mat[C00] = 1;
        this.mat[C10] = 0;
        this.mat[C20] = 0;
        this.mat[C01] = 0;
        this.mat[C11] = 1;
        this.mat[C21] = 0;
        this.mat[C02] = 0;
        this.mat[C12] = 0;
        this.mat[C22] = 1;
    };

    public copy(other: Matrix3): Matrix3 {
        for (let ii = 0; ii <= C22; ii++) {
            this.mat[ii] = other.mat[ii];
        }
        return this;
    };

    public clone(): Matrix3 {
        let other = new Matrix3();
        return other.copy(this);
    };

    public static multiply(matA: Matrix3, matB: Matrix3): Matrix3 {
        let dest = new Matrix3();

        let xx: number;
        let yy: number;
        let zz: number;
        let sum: number;

        for (xx = 0; xx < 3; xx++) {
            for (yy = 0; yy < 3; yy++) {
                sum = 0;
                for (zz = 0; zz < 3; zz++) {
                    sum += matA.mat[xx + zz * 3] * matB.mat[zz + yy * 3];
                }
                dest.mat[xx + yy * 3] = sum;
            }
        }

        return dest;
    };

    public static translate(mat: Matrix3, x: number, y: number): Matrix3 {
        let trans = new Matrix3();
        trans.mat[C20] = x;
        trans.mat[C21] = y;

        return Matrix3.multiply(trans, mat);
    };

    public static rotate(mat: Matrix3, angle: number): Matrix3 {
        if (angle === 0) {
            return mat.clone();
        }
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        let rot = new Matrix3();

        rot.mat[C00] = cos;
        rot.mat[C01] = sin;
        rot.mat[C10] = -sin;
        rot.mat[C11] = cos;

        return Matrix3.multiply(rot, mat);
    };

    public static rotateDegrees(mat: Matrix3, angle: number): Matrix3 {
        return Matrix3.rotate(mat, angle * (Math.PI / 180));
    };

    public static scale(mat: Matrix3, x: number, y: number): Matrix3 {
        let scale = new Matrix3();

        scale.mat[C00] = x;
        scale.mat[C11] = y;

        return Matrix3.multiply(scale, mat);
    };

    public static multiplyVector(mat: Matrix3, vector: Vector2): Vector2 {
        return Matrix3.multiplyVectorDirect(mat, vector.clone());
    };

    public static multiplyVectorDirect(mat: Matrix3, vector: Vector2): Vector2 {
        //z is 0
        vector.x = mat.mat[C00] * vector.x + mat.mat[C01] * vector.x + mat.mat[C02] * vector.x + mat.mat[C20];
        vector.y = mat.mat[C10] * vector.y + mat.mat[C11] * vector.y + mat.mat[C12] * vector.y + mat.mat[C21];

        return vector;
    };

    public static determinant(mat: Matrix3): number {
        let sum = mat.mat[C00] * mat.mat[C11] * mat.mat[C22];
        sum += mat.mat[C10] * mat.mat[C21] * mat.mat[C02];
        sum += mat.mat[C20] * mat.mat[C01] * mat.mat[C12];

        sum -= mat.mat[C20] * mat.mat[C11] * mat.mat[C02];
        sum -= mat.mat[C10] * mat.mat[C01] * mat.mat[C22];
        sum -= mat.mat[C00] * mat.mat[C21] * mat.mat[C12];

        return sum;
    };

    public static inverse(mat: Matrix3): Matrix3 {
        let det = Matrix3.determinant(mat);
        if (det === 0) {
            //matrix is not invertable
            return new Matrix3();
        }
        let factor = 1 / det;
        let result = new Matrix3();
        let matAccesor = mat.mat;
        let resultAccesor = result.mat;

        resultAccesor[C00] = factor * (matAccesor[C22] * matAccesor[C11] - matAccesor[C12] * matAccesor[C21]);
        resultAccesor[C10] = factor * (matAccesor[C12] * matAccesor[C20] - matAccesor[C22] * matAccesor[C10]);
        resultAccesor[C20] = factor * (matAccesor[C21] * matAccesor[C10] - matAccesor[C11] * matAccesor[C20]);

        resultAccesor[C01] = factor * (matAccesor[C02] * matAccesor[C21] - matAccesor[C22] * matAccesor[C01]);
        resultAccesor[C11] = factor * (matAccesor[C22] * matAccesor[C00] - matAccesor[C02] * matAccesor[C20]);
        resultAccesor[C21] = factor * (matAccesor[C01] * matAccesor[C20] - matAccesor[C21] * matAccesor[C00]);

        resultAccesor[C02] = factor * (matAccesor[C12] * matAccesor[C01] - matAccesor[C02] * matAccesor[C11]);
        resultAccesor[C12] = factor * (matAccesor[C02] * matAccesor[C10] - matAccesor[C12] * matAccesor[C00]);
        resultAccesor[C22] = factor * (matAccesor[C11] * matAccesor[C00] - matAccesor[C01] * matAccesor[C10]);

        return result;
    };

};