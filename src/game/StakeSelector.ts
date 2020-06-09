import {BitmapText, Container, Loader, Sprite} from 'pixi.js';
import {Signal} from "signals";

export class StakeSelector extends Container {

    private stakes:number[] = [1,2,5,10,20,50];
    private stakeIndex:number = 0;
    public stakeChanged:Signal = new Signal();
    public playClicked:Signal = new Signal();
    private minus: Sprite;
    private plus: Sprite;
    private _stakeText: BitmapText;

    constructor() {
        super();
        this.build();
        this.setEnabled();
    }

    public show(){
        this.visible = true;
    }

    public hide(){
        this.visible = false;
    }

    private build() {
        const uiElements = Loader.shared.resources.ui;

        this.minus = new Sprite(uiElements.textures['minus.png']);
        const panelVS1 = new Sprite(uiElements.textures['panelVS1.png']);
        const panelVS2 = new Sprite(uiElements.textures['panelVS2.png']);
        const panelVS3 = new Sprite(uiElements.textures['panelVS3.png']);
        this.plus = new Sprite(uiElements.textures['plus.png']);


        this.plus.anchor.set(0.5);
        this.minus.anchor.set(0.5);

        this.minus.name = 'minus';
        panelVS1.name = 'panelVS1';
        panelVS2.name = 'panelVS2';
        panelVS3.name = 'panelVS3';
        this.plus.name = 'plus';

        this.addChild(panelVS1);
        this.addChild(panelVS2);
        this.addChild(panelVS3);
        panelVS1.x = 534;
        panelVS1.y = 400;
        panelVS2.x = 534;
        panelVS2.y = 894;
        panelVS3.x = 534;
        panelVS3.y = 1114;

        this.addChild(this.plus);
        this.plus.x = 800;
        this.plus.y = 1050;
        this.addChild(this.minus);
        this.minus.x = 600;
        this.minus.y = 1050;

        this.minus.on('pointerdown',()=>this.onMinus());
        this.plus.on('pointerdown',()=>this.onPlus());

        const buttonBackground = new Sprite(uiElements.textures['buttonBackground.png']);
        buttonBackground.x = 595;
        buttonBackground.y = 1147;
        this.addChild(buttonBackground);
        buttonBackground.interactive = true;
        buttonBackground.on('pointerdown',()=>this.playClicked.dispatch());

        this._stakeText = new BitmapText(`$${this.stakes[this.stakeIndex]}`, { font: {name:'worksans-orange-export', size:64}, align: 'left' });
        this._stakeText.x = 674;
        this._stakeText.y = 924;
        this.addChild(this._stakeText);


    }

    private onMinus() {
        this.stakeIndex--;
        this.setEnabled();
        this.updateText();
        this.stakeChanged.dispatch(this.stakes[this.stakeIndex]);
    }

    private onPlus() {
        this.stakeIndex++;
        this.setEnabled();
        this.updateText();
        this.stakeChanged.dispatch(this.stakes[this.stakeIndex]);
    }

    private setEnabled() {
        this.minus.interactive = true;
        this.plus.interactive = true;
        if(this.stakeIndex == 0){
            this.minus.interactive = false;
        }else if(this.stakeIndex == this.stakes.length -1){
            this.plus.interactive = false;
        }
    }

    private updateText() {
        this._stakeText.text = `$${this.stakes[this.stakeIndex]}`;
    }
}