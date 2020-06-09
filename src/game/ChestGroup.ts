import {Container} from 'pixi.js';
import {Chest} from "./Chest";
import {Signal} from "signals";

export class ChestGroup extends Container{

    private _chests:Chest[];
    private _enabled: boolean = false;
    public opened:Signal = new Signal();
    public completed:Signal = new Signal();

    constructor() {
        super();
        this.build();
    }

    public set prizes(value:string[]){
        value.forEach((prize,index)=>{
            this._chests[index].prize = prize;
        });
    }

    public set enabled(value:boolean){
        if(this._enabled != value){
            this._enabled = value;
            this._chests.forEach(chest=>chest.enabled = this._enabled);
        }
    }

    public setWin(prizeMatches: number[]) {
        prizeMatches.forEach(index=>{
            this._chests[index].isWin = true;
        })
    }

    public reset(){
        this._chests.forEach(chest=>chest.reset());
    }

    private build() {
        const spacingX = 194;
        const chestPositions:{x:number,y:number}[] =
            [
                {x:540,y:900},
                {x:540 + spacingX,y:900},
                {x:540 + 2 * spacingX,y:900},
                {x:540 + 3 * spacingX,y:900},
                {x:540,y:1050},
                {x:540 + spacingX,y:1050},
                {x:540 + 2 * spacingX,y:1050},
                {x:540 + 3 * spacingX,y:1050},
                {x:540 + 4 * spacingX,y:1050}
            ];
        this._chests = chestPositions
            .map((point)=>{
                const chest = new Chest();
                chest.x = point.x;
                chest.y = point.y;
                chest.angle = 5-10*Math.random();
                return chest;
            });
        this.addChild(...this._chests);
        this._chests.forEach(chest=>{
            chest.opened.add((item)=>{
                this.opened.dispatch(this._chests.indexOf(item));
            });
            chest.completed.add((item)=>{
                this.completed.dispatch(this._chests.indexOf(item));
            });
        })
    }
}