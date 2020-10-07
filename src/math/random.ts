
const M = 0xffffffff; //modulus - 2^32 or 4 bytes
const A = 1664525; //multiplier
const C = 1013904223; //increment

let Random = function (_seed) {
	let seed;
	let z;

	let setSeed = function (newSeed) {
		seed = newSeed || Math.round(Math.random() * M); //get a random seed using Math.random();
		seed = seed % M;
		z = seed;
	};

	let getSeed = function () {
		return seed;
	};

	let getNext = function () {
		z = (A * z + C) % M;
		return z;
	};

	let getRandom = function () {
		return getNext() / M;
	};

	let getFloat = function (a, b) {
		if (!b) {
			b = a;
			a = 0;
		}
		if (!b) {
			b = 1;
		}

		return a + getRandom() * (b - a);
	};

	let getInt = function (a, b) {
		a = a || 0;
		b = b || 0;
		if (b < a) {
			let t = a;
			a = b;
			b = t;
		}
		return Math.floor(getFloat(a, b + 1));
	};

	let getBool = function (chance) {
		chance = chance === undefined ? 0.5 : chance;
		return (getRandom() < chance);
	};

	let pick = function (arr) {
		let idx = Math.floor(getRandom() * arr.length);
		return arr[idx];
	};

	//https://en.wikipedia.org/wiki/Marsaglia_polar_method
	let __ndSpare;
	let normalDistribution = function (mean, stdDev) {
		let u;
		let v;
		let s;
		if (__ndSpare !== undefined) {
			s = __ndSpare;
			__ndSpare = undefined;
			return mean + s * stdDev;
		}

		do {
			u = getRandom() * 2 - 1;
			v = getRandom() * 2 - 1;
			s = u * u + v * v
		} while (s > 1 || s === 0);

		let mul = Math.sqrt(-2 * Math.log(s) / s);
		__ndSpare = u * mul;
		return mean + v * mul * stdDev;
	};

	setSeed(_seed);

	let mod = {
		setSeed: setSeed,
		getSeed: getSeed,

		next: getNext,
		getNext: getNext,

		getRandom: getRandom,
		random: getRandom,

		getFloat: getFloat,
		float: getFloat,
		range: getFloat,

		getInt: getInt,
		int: getInt,

		getBool: getBool,
		boolean: getBool,
		bool: getBool,

		angle: function () {
			return getFloat(0, Math.PI * 2);
		},

		pick: pick,

		normalDistribution: normalDistribution
	};

	Object.defineProperty(mod, "seed", {
		get: getSeed,
		set: setSeed
	});

	return mod;
};


export default Random;