import {Application, Container, Graphics, Point} from "pixi.js"
import * as PIXI from 'pixi.js';
import TARGET_FPMS = PIXI.settings.TARGET_FPMS;
import {IFullscreenContent} from "../fullscreen/IFullscreenContent";
import {AlignH, AlignV, isTAlignment, Orientation, TAbsoluteAlignedItem, TAlignment, TAppAlignment} from "../fullscreen/types";
import {Game} from "./Game";

window.PIXI = PIXI; // to allow pixi devtools for pixi v5

export class GameApp extends Application implements IFullscreenContent {

    public appAlignment: TAppAlignment = {
        /*
                        alignment: {
                            size: new Point(1920, 1080),
                            alignH: AlignH.center,
                            alignV: AlignV.center
                        }
        */
        alignment: {
            landscape: {
                size: new Point(1920, 1080),
                alignH: AlignH.center,
                alignV: AlignV.center
            },
            portrait: {
                size: new Point(1920, 1080),
                alignH: AlignH.center,
                alignV: AlignV.center
            }
        }
    };
    public absoluteAlignedItems: TAbsoluteAlignedItem[];

    private _bg: Graphics;
    private _appContent: Graphics;
    public stage: Container;
    private _game: Game;


    constructor() {
        super({backgroundColor: 0x888888,});
        document.body.appendChild(this.renderer.view);
        this.createStage();
        this.createBackground();
        this.createAppGfx();
        this.createContainers();
        this.createLoader();
    }

    private loadComplete() {
        this._game = new Game();
        this.stage.addChild(this._game);
        this.ticker.add(delta => this.update(0.001 * delta / TARGET_FPMS));
    }

    private createStage() {
        this.stage = new Container();
    }

    public updateOrientation(value: Orientation) {
        this._appContent.clear();
        this._appContent.beginFill(0);
        if(this._game){
            this._game.updateOrientation(value);
        }

        let alignment: TAlignment;
        if (isTAlignment(this.appAlignment.alignment)) {
            alignment = this.appAlignment.alignment as TAlignment;
            this._appContent.drawRect(0, 0, alignment.size.x, alignment.size.y);
        } else {
            if (value == Orientation.portrait) {
                alignment = this.appAlignment.alignment.portrait as TAlignment;
                this._appContent.drawRect(0, 0, alignment.size.x, alignment.size.y);
            } else {
                alignment = this.appAlignment.alignment.landscape as TAlignment;
                this._appContent.beginFill(0);
                this._appContent.drawRect(0, 0, alignment.size.x, alignment.size.y);
            }
        }
    }

    public backgroundRect(rect: PIXI.Rectangle) {
        this._bg.clear();
        this._bg.beginFill(0);
        this._bg.drawRect(rect.x, rect.y, rect.width, rect.height);
    }

    private createBackground() {
        this._bg = new Graphics();
        this.stage.addChild(this._bg);
    }

    private createContainers() {
        this.absoluteAlignedItems = [];
    }

    private createCircleMarker(): Container {
        const container = new Container();
        const gfx = new Graphics();
        gfx.beginFill(0xff0000);
        gfx.drawCircle(0, 0, 50);
        container.addChild(gfx);
        this.stage.addChild(container);
        return container;
    }

    private createAppGfx() {
        this._appContent = new Graphics();
        this.stage.addChild(this._appContent);
    }

    private update(delta: number) {
        // this._player.update(delta);
        this._game.update(delta);
    }

    private createLoader() {
        const loader = PIXI.Loader.shared; // PixiJS exposes a premade instance for you to use.
        //images
        loader.add('test', 'assets/test.png');
        loader.add('background','assets/images/background.png');
        loader.add('logo', 'assets/images/logo.png');

        //spritesheets
        loader.add('backgroundElements', 'assets/images/backgroundElements.json');
        loader.add('chest', 'assets/images/chest.json');
        loader.add('language', 'assets/images/language.json');
        loader.add('ui', 'assets/images/ui.json');

        //fonts
        loader.add('skranji-interface','assets/images/skranji-interface-export.xml');
        loader.add('skranji-white','assets/images/skranji-white-export.xml');
        loader.add('skranji-yellow','assets/images/skranji-yellow-export.xml');
        loader.add('worksans-orange','assets/images/worksans-orange-export.xml');
        loader.add('skranji-white-interface','assets/images/skranji-white-interface-export.xml');

        loader.load(() => {
            this.loadComplete();
        });
/*
        loader.onProgress.add(() => {}); // called once per loaded/errored file
        loader.onError.add(() => {}); // called once per errored file
        loader.onLoad.add(() => {}); // called once per loaded file
        loader.onComplete.add(() => {}); // called once when the queued resources all load.
*/
    }
}