type Listener = {
    callback: Callback,
    context: any | null,
    __active : boolean
};

type Callback = (...args: any[]) => void;

class Dispatcher {
    private _listeners: { [key: string]: Listener[] } = {};
    private _newKeys: string[] = [];
    private _cleanKeys: string[] = [];

    constructor() {

    };

    private _cleanListeners(key: string): void {
        let idx = this._cleanKeys.indexOf(key);
        if (idx === -1) return;

        for (let ii = this._listeners[key].length - 1; ii >= 0; ii--) {
            if (this._listeners[key][ii].__active === false) {
                this._listeners[key].splice(ii, 1);
            }
        }

        this._cleanKeys.splice(idx, 1);
    };

    public on(key: string, cb: Callback, context: any | null): void {
        this._listeners[key] = this._listeners[key] || [];

        if (this._newKeys.indexOf(key) === -1) {
            this._newKeys.push(key);
        }

        let listener: Listener = {
            callback: cb,
            context: context || null,
            __active : true
        };

        this._listeners[key].push(listener);
    };

    public once(key: string, cb: Callback, context: any | null): void {
        //deregisters itself the first time it's called
        let wrapper = function () {
            this.off(key, wrapper);
            return cb.apply(context, [...arguments]);
        }

        this.on(key, wrapper, context);
    };

    public off(key: string, cb: Callback, context: any | null): void {
        var list = this._listeners[key];
        if (!list) return;

        context = context || null;

        for (let ii = list.length - 1; ii >= 0; ii--) {
            if (list[ii] && list[ii].callback === cb && list[ii].context === context) {
                list[ii].__active = false;
            }
        }

        if (this._cleanKeys.indexOf(key) === -1) {
            this._cleanKeys.push(key);
        }
    };

    public emit(key, data?: any, preventCancel: boolean = false): void {
        let list = this._listeners[key];
        if (!list) return;

        this._cleanListeners(key);

        let doCancel;
        for (let ii = 0; ii < list.length; ii++) {
            if (list[ii].__active === false) continue;
            doCancel = list[ii].callback.call(list[ii].context, data);
            if (doCancel && !preventCancel) break;
        }
    };
};

export default Dispatcher;