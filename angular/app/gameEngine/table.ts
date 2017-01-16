import {Card} from "./card";
import {Hand} from "./hand";

export class table{

	public gameArea: Hand;
	public trump: Card;

	public constructor(){
	this.gameArea = [];
	this.trump = null;
	}




}