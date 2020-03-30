let Dispatcher = function () {
    let _listeners = {};

    let _newKeys = [];
    let _cleanKeys = [];

    let _sortListeners = function (key) {
        let idx = _newKeys.indexOf(key);
        if (idx === -1) return;

        _listeners[key].sort(function (a, b) {
            return a.priority - b.priority
        });

        _newKeys.splice(idx, 1);
    };

    let _cleanListeners = function (key) {
        let idx = _cleanKeys.indexOf(key);
        if (idx === -1) return;

        let ii;
        for (ii = _listeners[key].length - 1; ii >= 0; ii--) {
            if (_listeners[key][ii] === undefined) {
                _listeners[key].splice(ii, 1);
            }
        }

        _cleanKeys.splice(idx, 1);
    };

    let on = function (key, cb, props) {
        _listeners[key] = _listeners[key] || [];
        props = props || {};

        if (_newKeys.indexOf(key) === -1) {
            _newKeys.push(key);
        }

        //TODO proper mix-in
        let listener = {
            callback: cb,
            priority: props.priority || 0,
            context: props.context || null
        };

        _listeners[key].push(listener);
    };

    let once = function (key, cb, props) {
        props = props || {};

        //deregisters itself the first time it's called
        let wrapper = function (data) {
            off(key, wrapper);
            return cb.call(props.context, data);
        }

        on(key, wrapper, props);
    };

    let off = function (key, cb) {
        var list = _listeners[key];
        if (!list) return;

        var ii;
        for (ii = list.length - 1; ii >= 0; ii--) {
            if (list[ii] && list[ii].callback === cb) {
                list[ii] = undefined;
            }
        }

        if (_cleanKeys.indexOf(key) === -1) {
            _cleanKeys.push(key);
        }
    };

    let emit = function (key, data, preventCancel) {
        let list = _listeners[key];
        if (!list) return;

        _sortListeners(key);
        _cleanListeners(key);

        let ii;
        let doCancel;
        for (ii = 0; ii < list.length; ii++) {
            if (list[ii] === undefined) continue;
            doCancel = list[ii].callback.call(list[ii].context, data);
            if (doCancel && !preventCancel) break;
        }
    };

    let module = {
        on: on,
        once: once,
        off: off,
        emit: emit
    };
    return module;
};

Dispatcher.make = function (target) {
    target.__dispatcher = new Dispatcher();
    for (let key in target.__dispatcher) {
        if (!target.__dispatcher.hasOwnProperty(key)) continue;
        target[key] = target.__dispatcher[key];
    }
};

export default Dispatcher;