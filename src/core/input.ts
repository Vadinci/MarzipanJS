import Screen from "../graphics/screen";
import Engine from "./engine";
import Keyboard from "./input/keyboard";
import Touch from "./input/touch";

class Input {
	private _keyboard: Keyboard;
	public get keyboard() { return this._keyboard; };

	private _touch: Touch;
	public get Touch() { return this._touch; };

	constructor(){
		this._keyboard = new Keyboard();
		this._touch = new Touch();
	};

	init(engine:Engine, screen:Screen){
		this._keyboard.init(engine);
		this._touch.init(engine, screen);
	};
};

export default Input;