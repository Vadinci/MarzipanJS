import { IStorageProcessor } from "../core/playerdata";

export interface ILocalStorageSettings {
	prefix?: string;
	mangle?: boolean;
}

export class LocalStorageProcessor implements IStorageProcessor {
	private _prefix: string = "";
	private _mangle: boolean = true;

	constructor(settings: ILocalStorageSettings) {
		this._prefix = settings.prefix ? (settings.prefix + "_") : ""
		this._mangle = settings.mangle !== void (0) ? settings.mangle : true;
	};


	public fetch(key: string, onComplete: (data: any) => void): void {
		let raw: string | null = localStorage.getItem(this._prefix + key);
		if (!raw) {
			onComplete(null);
			return;
		}
		let data: any;
		if (this._mangle) {
			let unmangled: string = atob(raw);
			data = JSON.parse(unmangled);
		} else {
			data = JSON.parse(raw);;
		}

		onComplete(data);
	};

	public write(key: string, data: any): void {
		let stringified: string = JSON.stringify(data);
		let toSave: string = stringified;
		if (this._mangle) toSave = btoa(stringified);

		localStorage.setItem(this._prefix + key, toSave);
	};

};