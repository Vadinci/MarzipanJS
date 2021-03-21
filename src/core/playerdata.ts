//TODO: work in progress

export interface IStorageProcessor {
	fetch(key: string, onComplete: (data: any) => void): void;
	write(key: string, data: any): void;
}

export class PlayerData {
	private _processor: IStorageProcessor;
	private _groups: { [key: string]: { [key: string]: any } } = {};
	private _saveTasks: { [key: string]: number } = {};

	public setProcessor(processor: IStorageProcessor): void {
		this._processor = processor;
	}

	public fetchGroup(group: string, onComplete: () => void): void {
		this._processor.fetch(group, data => {
			this._groups[group] = data || {};
			onComplete && onComplete();
		});
	}

	public load(group: string, key: string): any {
		if (!this._groups[group]) {
			this._groups[group] = {};
			this.fetchGroup(group, () => { });
		}
		return this._groups[group][key];
	}

	public save(group: string, key: string, value: any): void {
		if (!this._groups[group]) {
			this._groups[group] = {};
			this.fetchGroup(group, () => { });
		}
		this._groups[group][key] = value;
		this._queueSaveTask(group);
	}

	private _queueSaveTask(group: string): void {
		if (this._saveTasks[group]) return;

		this._saveTasks[group] = window.setTimeout(() => {
			delete this._saveTasks[group];
			this._processor.write(group, this._groups[group]);
		}, 10);
	}
}