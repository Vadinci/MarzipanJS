const ENSURE = function <T>(val: T): T {
	if (val === void (0)) throw new Error("value is required!");
	return val;
};

export default ENSURE;