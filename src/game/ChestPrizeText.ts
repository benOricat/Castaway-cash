import {Container, BitmapText} from 'pixi.js';

export class ChestPrizeText extends Container{

    private _baseTextField: BitmapText;
    private _winTextField: BitmapText;
    private _text: string;

    constructor() {
        super();
        this.build();
    }

    public set isWin(value:boolean){
        this._baseTextField.visible = !value;
        this._winTextField.visible = value;
    }

    public set text(value:string){
        this._text = value;
        this._baseTextField.text = this._text;
        this._winTextField.text = this._text;
        this.isWin = false;
    }

    private build() {

        this._baseTextField = new BitmapText('$20', { font: {name:'skranji-white-export', size:44}, align: 'left' });
        this._winTextField = new BitmapText('$20', { font: {name:'skranji-yellow-export', size:44}, align: 'left' });

        this.addChild(this._baseTextField);
        this.addChild(this._winTextField);

    }
}