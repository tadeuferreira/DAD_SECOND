import {Hand} from "./hand";


export enum PlayerType{
	Me,
	Friend,
	Foe1,
	Foe2
}
export class GamePlayer{

public hand: Hand;
public type: PlayerType;
public isTurn: boolean;

public constructor(type: PlayerType){
	this.hand = [];
	this.type = type;
	this.isTurn = false;
}
}