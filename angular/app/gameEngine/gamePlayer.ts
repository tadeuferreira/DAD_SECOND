import {Card} from "./card";


export enum PlayerType{
	Me,
	Friend,
	Foe1,
	Foe2
}
export class GamePlayer{

public hand: Card[];
public tableCard: Card;
public type: PlayerType;
public isTurn: boolean;
public avatar: string;
public username: string;
public id: string;
public team:number;
public team_pos:number;

public constructor(type: PlayerType, avatar: string, username: string, id: string, team:number, team_pos:number){
	this.hand = [];
	this.type = type;
	this.isTurn = false;
	this.id = id;
	this.avatar = avatar;
	this.username = username;
	this.team = team;
	this.team_pos = team_pos;
	this.tableCard = null;
}
}