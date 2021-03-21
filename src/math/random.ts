const M = 0xffffffff; //modulus - 2^32 or 4 bytes
const A = 1664525; //multiplier
const C = 1013904223; //increment

export class Random {
	private _seed: number;
	private _z: number;

	constructor(seed?: number) {
		if (seed === void (0)) {
			seed = Math.round(Math.random() * M);
		}
		this.seed = seed;
	};

	set seed(newSeed: number) {
		this._seed = newSeed % M;
		this._z = this._seed;
	};
	get seed(): number { return this._seed; };

	public next(): number {
		this._z = (A * this._z + C) % M;
		return this._z;
	};

	public random(): number {
		return this.next() / M;
	};

	public float(a?: number, b?: number): number {
		if (!a) a = 1;
		if (!b) {
			b = a;
			a = 0;
		}

		return a + this.random() * (b - a);
	};

	public int(a?: number, b?: number): number {
		a = a || 0;
		b = b || 0;
		if (b < a) {
			let t = a;
			a = b;
			b = t;
		}
		return Math.floor(this.float(a, b + 1));
	};

	public bool(chance: number): boolean {
		chance = (chance === undefined ? 0.5 : chance);
		return (this.random() < chance);
	};

	public pick(arr: Array<any>): any {
		let idx = Math.floor(this.random() * arr.length);
		return arr[idx];
	};

	//https://en.wikipedia.org/wiki/Marsaglia_polar_method
	private __ndSpare: number | null = null;
	public normalDistribution(mean: number, stdDev: number): number {
		let u: number;
		let v: number;
		let s: number;
		if (this.__ndSpare !== null) {
			s = this.__ndSpare;
			this.__ndSpare = null;
			return mean + s * stdDev;
		}

		do {
			u = this.random() * 2 - 1;
			v = this.random() * 2 - 1;
			s = u * u + v * v
		} while (s > 1 || s === 0);

		let mul = Math.sqrt(-2 * Math.log(s) / s);
		this.__ndSpare = u * mul;
		return mean + v * mul * stdDev;
	};

	public angle(): number {
		return this.float(0, Math.PI * 2);
	};
};