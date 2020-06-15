
export enum Currenrcy  {USD='USD'}

export type TInitResponse = {
    gameId:string;
    pricePoints: number[];
    currency:Currenrcy;
    availablePrizes: number[],
};

export type TPlayResponse = {
    winner:boolean,
    prizeIndexes:number[],
    winningIndexes:number[]
};

export type TCloseResponse = {
    success:boolean
};