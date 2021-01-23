let MathUtils = {
	clamp: (min: number, val: number, max: number): number => Math.max(min, Math.min(val, max))
};

export default MathUtils;