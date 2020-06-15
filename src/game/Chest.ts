import {AnimatedSprite, Container, Loader, Rectangle} from 'pixi.js';
import {ChestPrizeText} from "./ChestPrizeText";
import {Signal} from "signals";


enum ChestStates {
    over,
    opening,
    opened,
    complete,
    closed
}

export class Chest extends Container{

    private _chestAnimation:AnimatedSprite;
    private _enabled: boolean = false;
    private _state:ChestStates = ChestStates.closed;
    private _prizeText: ChestPrizeText;
    public opened:Signal = new Signal();
    public completed:Signal = new Signal();

    constructor() {
        super();
        this.build();
        this.addInteractivity();
    }

    public set isWin(value:boolean){
        this._prizeText.isWin = value;
        this.completed.dispatch(this);
    }

    public set prize(value:string){
        this._prizeText.text = value;
    }

    public set enabled(value:boolean){
        if(this._enabled != value){
            this._enabled = value;
            this.interactive = value;
        }
    }

    public reset(){
        this.isWin = false;
        this._prizeText.visible = false;
        this._chestAnimation.gotoAndStop(0);
    }

    private build() {
        // create an animated sprite
        const baseNum:string = '0000000000';
        const numStr:(num:number,len:number)=>string = (num:number,len:number)=>{
            let numString = ''+num;
            return baseNum.slice(0, len - numString.length) + numString;
        };

        const chestAssets = Loader.shared.resources.chest;
        const textures = new Array(35)
                .fill(null)
                .map((val,index)=>`chest_animation${numStr(1+index,4)}.png`)
                .map(name=>chestAssets.textures[name]);

        this._chestAnimation = new AnimatedSprite(textures);
        this._chestAnimation.animationSpeed = 1;
        this._chestAnimation.loop = false;
        this._chestAnimation.onFrameChange = ()=>this.onFrameChange();
        this._chestAnimation.onComplete = ()=>this.onComplete();
        this.addChild(this._chestAnimation);

        this.addChild(this._chestAnimation);

        this.hitArea = new Rectangle(0,0.3*this._chestAnimation.height,this._chestAnimation.width,0.7*this._chestAnimation.height);

        this._prizeText = new ChestPrizeText();
        this._prizeText.x = 70;
        this._prizeText.y = 30;
        this._prizeText.visible = false;
        this.addChild(this._prizeText);
    }

    private onComplete() {
        this._state = ChestStates.opened;
        this.opened.dispatch(this);
    }

    private onFrameChange() {
        switch (this._state) {
            case ChestStates.over:
                if(this._chestAnimation.currentFrame >= 6){
                    this._chestAnimation.stop();
                }
                break;
            case ChestStates.opening:
                if(this._chestAnimation.currentFrame > 20){
                    this._prizeText.visible = true;
                }
                break;
        }
    }

    private onButtonOut() {
        this._state = ChestStates.closed;
        this._chestAnimation.gotoAndStop(0);
    }

    private onButtonOver() {
        this._state = ChestStates.over;
        this._chestAnimation.gotoAndPlay(0);
    }

    private onButtonDown() {
        this.enabled = false;
        this._state = ChestStates.opening;
        this._chestAnimation.gotoAndPlay(10);
    }

    private addInteractivity() {
        this
            // Mouse & touch events are normalized into
            // the pointer* events for handling different
            // button events.
            .on('pointerdown', this.onButtonDown)
            .on('pointerupoutside', this.onButtonOut)
            .on('pointerover', this.onButtonOver)
            .on('pointerout', this.onButtonOut);
    }
}