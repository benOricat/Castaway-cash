import {Container} from 'pixi.js';
import {Orientation} from "../fullscreen/types";
import {ChestGroup} from "./ChestGroup";
import {BackgroundGroup} from "./BackgroundGroup";
import {Utils} from "./Utils";
import {StakeSelector} from "./StakeSelector";
import {GameFlow} from "../gameFlow/GameFlow";

export class Game extends Container{

    private _bg: BackgroundGroup;
    private totalTime = 0;
    private _chestGroup: ChestGroup;
    private _stake:number = 1;
    private _results:number[][] = [
        [1,1,1,5,5,2,2,10,20],//one prize
        [1,1,1,5,5,5,2,10,20],//two prizes
        [1,1,5,5,2,2,10,20,20]//noPrize
    ];

    private _resultIndex:number = -1;
    private _currentResult:number[];
    private _revealedPrizes:number[];
    private _stakeSelector: StakeSelector;
    private _chestsOpened:number;

    constructor() {
        super();
        this.scale.set(1.8);
        this.x = -814;
        this.y = -1219;
        this.createBg();
        this.createChests();
        this.createStakeSelector();
        //test code for promises
        new GameFlow();
    }


    private createBg() {
        this._bg = new BackgroundGroup();
        this.addChild(this._bg);
    }

    private createChests() {
        this._chestGroup = new ChestGroup();
        this.addChild(this._chestGroup);
        this._chestGroup.opened.add((index)=>this.onOpened(index));
        this._chestGroup.completed.add((index)=>this.onCompleted(index));
    }

    public update(delta: number) {
        this.totalTime+=delta;
    }

    public updateOrientation(value: Orientation) {
        if (value == Orientation.portrait) {
            // this._zoomView.maskRect = new Rectangle(0,0,1080, 1920);
        } else {
            // this._zoomView.maskRect = new Rectangle(0,0,1920, 1080);
        }
    }

    private startGame() {
        this._revealedPrizes = [];
        this._chestsOpened = 0;
        this._resultIndex = (this._resultIndex+1)%this._results.length;
        this._currentResult = Utils.shuffleArray(this._results[this._resultIndex])
            .map(value=>this._stake*value);
        this._chestGroup.prizes = this._currentResult.map(value=>`$${value}`);
        this._chestGroup.enabled = true;
    }

    private onOpened(index: number) {
        const prize:number = this._currentResult[index];
        this._revealedPrizes.push(index);
        const prizeMatches:number[] = this._revealedPrizes.reduce(
            (arr:number[], value:number)=> {
                if (this._currentResult[value] === prize){
                    arr.push(value);
                }
                return arr;
        }, []);

        if(prizeMatches.length>=3){
            this._chestGroup.setWin(prizeMatches);
        }

        if(this._revealedPrizes.length==9){
            this.showResult();
        }
        this._chestsOpened++;
        if(this._chestsOpened == 9){
            this._chestGroup.enabled = false;
            setTimeout(()=>{
                this.resetGame();
            },2000);
        }

    }

    private onCompleted(index: number) {
    }

    private showResult() {

    }

    private createStakeSelector() {
        this._stakeSelector = new StakeSelector();
        this.addChild(this._stakeSelector);
        this._stakeSelector.stakeChanged.add((stake)=>{
            this._stake = stake;
        });
        this._stakeSelector.playClicked.add(()=>{
            this._stakeSelector.hide();
            this.startGame();
        });
    }

    private resetGame() {
        this._chestGroup.reset();
        this._stakeSelector.show();
    }
}