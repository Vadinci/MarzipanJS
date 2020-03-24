var Matrix3 = {};

const C00 = 0;
const C10 = 1;
const C20 = 2;

const C01 = 3;
const C11 = 4;
const C21 = 5;

const C02 = 6;
const C12 = 7;
const C22 = 8;

const IDENTITY = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
];

Matrix3.identity = function () {
    return [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ];
};

Matrix3.reset = function (mat) {
    mat[0] = 1;
    mat[1] = 0;
    mat[2] = 0;

    mat[3] = 0;
    mat[4] = 1;
    mat[5] = 0;

    mat[6] = 0;
    mat[7] = 0;
    mat[8] = 1;
};

Matrix3.clone = function (source) {
    return [].concat(source);
};

Matrix3.multiply = function (matA, matB) {
    var dest = Matrix3.identity();

    var xx;
    var yy;
    var zz;
    var sum;

    for (xx = 0; xx < 3; xx++) {
        for (yy = 0; yy < 3; yy++) {
            sum = 0;
            for (zz = 0; zz < 3; zz++) {
                sum += matA[xx + zz * 3] * matB[zz + yy * 3];
            }
            dest[xx + yy * 3] = sum;
        }
    }

    return dest;
};

Matrix3.translate = function (mat, x, y) {
    var trans = Matrix3.identity();
    trans[C20] = x;
    trans[C21] = y;

    return Matrix3.multiply(trans, mat);
};

Matrix3.rotate = function (mat, angle) {
    if (angle === 0) {
        return mat;
    }
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    var rot = Matrix3.identity();

    rot[C00] = cos;
    rot[C01] = sin;
    rot[C10] = -sin;
    rot[C11] = cos;

    return Matrix3.multiply(rot, mat);
};

Matrix3.rotateDegrees = function (mat, angle) {
    return Matrix3.rotate(mat, angle * (Math.PI / 180));
};

Matrix3.scale = function (mat, x, y) {
    var scale = Matrix3.identity();

    scale[C00] = x;
    scale[C11] = y;

    return Matrix3.multiply(scale, mat);
};

/*
 * Vectors
 */
Matrix3.multiplyVector = function (mat, vector) {
    //z is 0
    var x = mat[C00] * vector.x + mat[C01] * vector.x + mat[C02] * vector.x + mat[C20];
    var y = mat[C10] * vector.y + mat[C11] * vector.y + mat[C12] * vector.y + mat[C21];

    return { x: x, y: y };
};

Matrix3.multiplyVectorDirect = function (mat, vector) {
    //z is 0
    vector.x = mat[C00] * vector.x + mat[C01] * vector.x + mat[C02] * vector.x;
    vector.y = mat[C10] * vector.y + mat[C11] * vector.y + mat[C12] * vector.y;

    return vector;
};

/*
 * Detrminant and inverse
 */
Matrix3.determinant = function (mat) {
    var sum = mat[C00] * mat[C11] * mat[C22];
    sum += mat[C10] * mat[C21] * mat[C02];
    sum += mat[C20] * mat[C01] * mat[C12];

    sum -= mat[C20] * mat[C11] * mat[C02];
    sum -= mat[C10] * mat[C01] * mat[C22];
    sum -= mat[C00] * mat[C21] * mat[C12];

    return sum;
};

Matrix3.inverse = function (mat) {
    var det = Matrix3.determinant(mat);
    if (det === 0) {
        //matrix is not invertable
        return Matrix3.identity;
    }
    var factor = 1 / det;
    var result = Matrix3.identity();

    result[C00] = factor * (mat[C22] * mat[C11] - mat[C12] * mat[C21]);
    result[C10] = factor * (mat[C12] * mat[C20] - mat[C22] * mat[C10]);
    result[C20] = factor * (mat[C21] * mat[C10] - mat[C11] * mat[C20]);

    result[C01] = factor * (mat[C02] * mat[C21] - mat[C22] * mat[C01]);
    result[C11] = factor * (mat[C22] * mat[C00] - mat[C02] * mat[C20]);
    result[C21] = factor * (mat[C01] * mat[C20] - mat[C21] * mat[C00]);

    result[C02] = factor * (mat[C12] * mat[C01] - mat[C02] * mat[C11]);
    result[C12] = factor * (mat[C02] * mat[C10] - mat[C12] * mat[C00]);
    result[C22] = factor * (mat[C11] * mat[C00] - mat[C01] * mat[C10]);

    return result;
};



export default Matrix3;