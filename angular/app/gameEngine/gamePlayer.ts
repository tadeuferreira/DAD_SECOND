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
public avatar: string;
public username: string;
public id: string;

public constructor(type: PlayerType, avatar: string, username: string, id: string){
	this.hand = null;
	this.type = type;
	this.isTurn = false;
}
}