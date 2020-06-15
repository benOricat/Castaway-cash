import {TCloseResponse, TInitResponse, TPlayResponse} from "./types";

export class Services{

    async requestInitResponse():Promise<TInitResponse>{
        console.log('request init data');
        const response = await fetch(`data/init.json`);
        const data:TInitResponse = await response.json();
        console.log('init response', data);
        return data;
    }

    async requestNewGame(stake:number, requestWin:boolean = false):Promise<TPlayResponse>{
        console.log('request new game');
        const response = await fetch(`data/playResponse_${requestWin? 'win':'loose'}.json`);
        const data:TPlayResponse = await response.json();
        console.log( 'new game data', data);
        return data;
    }

    async requestClose():Promise<TCloseResponse>{
        console.log('request close game');
        const response = await fetch(`data/close.json`);
        const data:TCloseResponse = await response.json();
        console.log('close game success', data);
        return data;
    }

}