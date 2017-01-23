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
	public stash: Card[];
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
		this.stash = [];
	}

	public updateCard(card: Card){

		var card_pos = -1;
		for (var i = 0; i < this.hand.length; ++i) {
			if(this.hand[i].id = card.id){
				card_pos = i;	
			}
		}
		this.hand.splice(card_pos, 1);
		this.tableCard = card;
	}
	public playCard(id:number){
		var card_pos = -1;
		for (var i = 0; i < this.hand.length; ++i) {
			if(this.hand[i].id == id){
				card_pos = i;	
			}
		}
		this.tableCard  = this.hand[card_pos];
		this.hand.splice(card_pos, 1);

		this.tableCard.isOnHand = false;
		this.tableCard.isOnTable = true;
		this.tableCard.isUsed = false;
		console.log(this.tableCard);
	}
}