export default val => {
	if (val === void (0)) throw new Error("value is required!");
	return val;
};