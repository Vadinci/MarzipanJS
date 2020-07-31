let LocalStorageProcessor = function (settings) {
	let _prefix = settings.prefix ? (settings.prefix + '_') : '';
	let _mangle = settings.mangle !== void (0) ? settings.mangle : true;

	let fetch = function (key, onComplete) {
		let raw = localStorage.getItem(_prefix + key);
		if (!raw) {
			onComplete();
			return;
		}
		let data;
		if (_mangle) {
			let stringified = atob(raw);
			data = JSON.parse(stringified);
		} else {
			data = JSON.parse(raw);;
		}

		onComplete(data);
	};

	let write = function (key, data) {
		let stringified = JSON.stringify(data);
		let raw = stringified;
		if (_mangle) raw = btoa(stringified);

		localStorage.setItem(_prefix + key, raw);
	};


	return {
		fetch,
		write
	}
};

export default LocalStorageProcessor;