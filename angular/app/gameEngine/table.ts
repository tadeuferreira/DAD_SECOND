import {Card} from "./card";
import {Hand} from "./hand";

export class Table{

	public gameArea: Hand;
	public trump: Card;

	public constructor(){
	this.gameArea = [];
	this.trump = null;
	}




}