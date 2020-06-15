import {Services} from "./Services";
import {sleep} from "./promiseUtils";
import {TCloseResponse, TInitResponse, TPlayResponse} from "./types";

enum EndGameChoice {PlayGame,ChangeStake}
enum GameClick {Chest,RevealAll}

export class GameFlow{

    private _initResponse: TInitResponse;

    private readonly _simulateUserDelay: boolean = true;
    private _selectedStake:number = 1;
    private _minMatches:number = 3;
    private _completed: boolean[];
    private _services: Services;

    constructor() {
        this._services = new Services();
        console.log('To run a simulation of a game play with promises run in the console\ninitialiseGame() and then\n gameloop(true) for a win or \ngameloop(false) for loosing');
        (window as any).initialiseGame = ()=>this.initialiseGame();
        (window as any).gameLoop = (requestWin:boolean)=>this.gameLoop(requestWin);
    }

    public async initialiseGame(){
        console.log('----------initialiseGame start----------');
        this._initResponse = await this._services.requestInitResponse();
        console.log('----------initialiseGame end----------');
        // await this.showStakePanel();
    };

    public async showStakePanel(){
        console.log('show stake panel');
        await this.playButtonInteraction();
        await this.gameLoop();
    }

    public async showEndChoice(){
        const choice:EndGameChoice = await this.endGameAction();
        switch (choice) {
            case EndGameChoice.ChangeStake:
                this.showStakePanel();
                break;
            case EndGameChoice.PlayGame:
                await this.gameLoop();
                break;
        }
    }

    public async gameLoop(requestWin:boolean = false){
        console.log('----------gameLoop start----------');
        const gameResponse:TPlayResponse = await this._services.requestNewGame(this._selectedStake, requestWin);
        const totalPrize:number = gameResponse.winner
            ? gameResponse.prizeIndexes[gameResponse.winningIndexes[0]] : 0;
        await this.playGame(gameResponse);
        await this.showTotalWin(totalPrize);
        const closeResponse:TCloseResponse = await this._services.requestClose();
        // await this.showEndChoice();
        console.log('----------gameLoop end----------');
    };

    public async playButtonInteraction():Promise<EndGameChoice>{
        if(this._simulateUserDelay){
            await sleep(Math.random());
        }
        console.log('play clicked');
        return EndGameChoice.PlayGame;
    }

    public async stakesButtonInteraction():Promise<EndGameChoice>{
        if(this._simulateUserDelay){
            await sleep(Math.random());
        }
        console.log('change stake clicked');
        return EndGameChoice.ChangeStake;
    }

    public async revealAllButtonInteraction():Promise<GameClick>{
        if(this._simulateUserDelay){
            await sleep(Math.random());
        }
        console.log('reveal all button clicked');
        return GameClick.RevealAll;
    }

    public async openChest(prize:number,index:number,result:number[]){
        console.log('opened '+index);
        this._completed[index] = true;
        await this.highlightWins(prize, result)
    }

    public async highlightWins(prize:number,result:number[]){
        const matches = result
            .filter((value,index)=>this._completed[index])
            .reduce((sum,value)=>prize==value ? sum+1:sum,0);
        if(matches>=3){
            const indexes:number[] = result.reduce((arr:number[], value, index)=>{
                if(prize==value){
                    arr.push(index)
                }
                return arr;
            },[]);
            await Promise.all([indexes.map(this.highlight)]);
            await this.updateWin(prize);
        }

    }

    public async chestReveal(prize:number,index:number,result:number[], delay:number):Promise<GameClick>{
        await sleep(delay);
        await this.openChest(prize,index,result);
        return GameClick.Chest;
    }

    public async chestClick(prize:number,index:number,result:number[]):Promise<GameClick>{
        if(this._simulateUserDelay){
            await sleep(Math.random());
        }
        await this.openChest(prize,index,result);
        return GameClick.Chest;
    }

    public async updateWin(prize:number){
        console.log('update total win '+prize)
    }

    public async showTotalWin(totalPrize){
        console.log('show total win ',totalPrize);
    }

    public async highlight(index:number) {
        console.log('highlight: '+ index);
    }

    public async playGame(gameResponse:TPlayResponse){
        const prizes:number[] = gameResponse.prizeIndexes.map(index=>this._initResponse.availablePrizes[index]*this._selectedStake);
        console.log('game starting', prizes);
        this._completed = gameResponse.prizeIndexes.map(()=>false);

        let gameChoice: GameClick;
        //TODO need to investigate cancel options for race loosing promises. Possible memory leak also?
/*
        //this code is to find which was pressed first chest or reveal all
        gameChoice = await Promise.race([
            this.revealAllButtonInteraction(),
            ...prizes.map((prize: number, index: number, result: number[]) => this.chestClick(prize, index, result))
        ]);
        //deactivate reveal all and remove it
*/
        switch (gameChoice) {
            case GameClick.RevealAll:
                await Promise.all(prizes.map((prize:number,index:number,result:number[])=>this.chestReveal(prize,index,result,0.3*index)));
                break;
            case GameClick.Chest:
            default:
                //choice was made by selecting a chest
                //await all the uncompleted buttons
                await Promise.all(
                    prizes
                        .filter((prize,index)=>!this._completed[index])
                        .map((prize:number,index:number,result:number[])=>this.chestClick(prize,index,result)));
                break;
        }
        console.log('game completed');
    }

    private async endGameAction():Promise<EndGameChoice> {
        return Promise.race([this.playButtonInteraction(), this.stakesButtonInteraction()])
    }
}