import {Card} from "./card";
import {Hand} from "./hand";

export class Table{

	public gameArea: Card[];
	public trump: Card;

	public constructor(trump : Card){
	this.gameArea = [null,null,null,null];
	this.trump = trump;
	}

	addCard(index:number, item:Card){
		this.gameArea.splice(index, 0, item);
	}




}