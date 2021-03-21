import { Assets } from "./core/assets";
import { Dispatcher } from "./core/dispatcher";
import { Engine } from "./core/engine";
import { Input } from "./core/input";
import { PlayerData } from "./core/playerdata";
import { Renderer } from "./graphics/renderer";
import { Screen } from "./graphics/screen";
import { WebRenderer } from "./graphics/web/webrenderer";

import { AudioLoader } from "./io/loaders/audioloader";
import { JsonLoader } from "./io/loaders/jsonloader";
import { PictureLoader } from "./io/loaders/pictureloader";
import { PlainLoader } from "./io/loaders/plainloader";
import { YamlLoader } from "./io/loaders/yamlloader";
import { Random } from "./math/random";

type MarzipanSettings = any;

export class Marzipan {
	public static instance: Marzipan;

	private _engine: Engine;
	static get engine(): Engine { return Marzipan.instance._engine; };

	private _assets: Assets;
	static get assets(): Assets { return Marzipan.instance._assets; };

	private _screen: Screen;
	static get screen(): Screen { return Marzipan.instance._screen; };

	private _renderer: Renderer;
	static get renderer(): Renderer { return Marzipan.instance._renderer; };

	private _input: Input;
	static get input(): Input { return Marzipan.instance._input; };

	private _playerData: PlayerData;
	static get playerData(): PlayerData { return Marzipan.instance._playerData; };

	private _events: Dispatcher;
	static get events(): Dispatcher { return Marzipan.instance._events; };

	private _random: Random;
	static get random(): Random { return Marzipan.instance._random; };

	constructor(settings: MarzipanSettings) {
		if (Marzipan.instance) {
			throw "A Marzipan instance already exists";
		}

		Marzipan.instance = this;

		this._events = new Dispatcher;

		this._assets = new Assets();
		this._assets.addLoader(new PlainLoader());
		this._assets.addLoader(new YamlLoader());
		this._assets.addLoader(new JsonLoader());
		this._assets.addLoader(new PictureLoader());
		this._assets.addLoader(new AudioLoader());

		this._screen = new Screen();
		this._screen.init(settings.screen);

		this._renderer = new WebRenderer({
			screen: this._screen
		});

		this._engine = new Engine();
		this._engine.init();

		this._input = new Input();
		this._input.init(this._engine, this._screen);

		this._random = new Random();
		
		this._playerData = new PlayerData();
	};

	static setup(settings: MarzipanSettings): void {
		if (!Marzipan.instance){
			new Marzipan(settings);
		}
	};
};