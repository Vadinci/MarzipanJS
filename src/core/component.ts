class Component {
	public name: string = 'component';

	constructor(){};

	public added(data: any): void { };

	public start(data: any): void { };
	public update(data: any): void { };
	public die(data: any): void { };

	public preDraw(data: any): void { };
	public draw(data: any): void { };
	public drawDebug(data: any): void { };
	public postDraw(data: any): void { };
};

export default Component;