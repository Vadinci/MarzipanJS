import Assets from "./core/assets";
import Dispatcher from "./core/dispatcher";
import Engine from "./core/engine";
import Input from "./core/input";
import { Renderer } from "./graphics/renderer";
import Screen from "./graphics/screen";
import WebRenderer from "./graphics/web/webrenderer";

import AudioLoader from "./io/loaders/audioloader";
import JsonLoader from "./io/loaders/jsonloader";
import PictureLoader from "./io/loaders/pictureloader";
import PlainLoader from "./io/loaders/plainloader";
import YamlLoader from "./io/loaders/yamlloader";
import Random from "./math/random";

type MarzipanSettings = any;

class Marzipan {
	public static instance: Marzipan | null = null;

	private _engine: Engine;
	static get engine(): Engine | undefined { return Marzipan.instance?._engine; };

	private _assets: Assets;
	static get assets(): Assets | undefined { return Marzipan.instance?._assets; };

	private _screen: Screen;
	static get screen(): Screen | undefined { return Marzipan.instance?._screen; };

	private _renderer: Renderer;
	static get renderer(): Renderer | undefined { return Marzipan.instance?._renderer; };

	private _input: Input;
	static get input(): Input | undefined { return Marzipan.instance?._input; };

	private _events: Dispatcher;
	static get events(): Dispatcher | undefined { return Marzipan.instance?._events; };

	private _random: Random;
	static get random(): Random | undefined { return Marzipan.instance?._random; };

	constructor(settings: MarzipanSettings) {
		if (Marzipan.instance !== null) {
			throw "A Marzipan instance already exists";
		}

		Marzipan.instance = this;

		this._events = new Dispatcher;

		this._assets = new Assets();
		this._assets.addLoader(PlainLoader);
		this._assets.addLoader(YamlLoader);
		this._assets.addLoader(JsonLoader);
		this._assets.addLoader(PictureLoader);
		this._assets.addLoader(AudioLoader);

		this._screen = new Screen();
		this._screen.init(settings.screenSettings);

		this._renderer = new WebRenderer({
			screen: this._screen
		});

		this._engine = new Engine();
		this._engine.init();

		this._input = new Input();
		this._input.init(this._engine, this._screen);

		this._random = new Random();
	};

	static start(settings: MarzipanSettings): void {
		new Marzipan(settings);
	};
};

export default Marzipan;