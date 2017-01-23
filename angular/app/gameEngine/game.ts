import {Card, SuitType} from "./card";
import {GamePlayer, PlayerType} from "./gamePlayer";
import {Table} from "./table";


export class Game{
	public players: GamePlayer[];
	public table: Table;
	public TrumpSuit : SuitType;
	public onTurn : number;
	public myTurnNumber : number;
	public isMyTurn : boolean;
	public isFirst : boolean;
	public jsonGame : any;


	public constructor(json: any){
		this.players = [null,null,null,null];
		this.initializeGame(json);
		this.jsonGame = json;
		this.isMyTurn = false;
	}


	private initializeGame(json:any){
		let first_id : string = json.first;
		let first_team : number;
		let first_pos : number;
		let deck : Card[] = [];
		let i : number = 0;
		let my_team : number = 0;
		let my_team_pos : number = 0;
		let my_id : string = sessionStorage.getItem('id');
		
		this.isFirst = (json.order[0] == my_id);

		for (i = 0; i < 40; ++i) {
			deck.splice(i, 0, new Card(i,json.pack.cards[i].type, json.pack.cards[i].suit, json.pack.cards[i].isOnHand, json.pack.cards[i].isOnTable,json.pack.cards[i].isUsed, null, false));
		}
		deck[0].isFirstTrump = true;
		this.TrumpSuit = deck[0].stype;

		//save my team and pos
		for (i = 0; i < 2; ++i) {
			if(json.team2[i].id == my_id){
				my_team = 2;
				my_team_pos = i;
			}else if(json.team1[i].id == my_id){
				my_team = 1;
				my_team_pos = i;
			}
		}
		//save my team mate id
		let team_mate_id : string;
		if(my_team == 1){
			team_mate_id = json.team1[ my_team_pos == 0 ? 1 : 0].id;
		}else if(my_team == 2){
			team_mate_id = json.team2[ my_team_pos == 0 ? 1 : 0].id;
		}

		let friend_order_pos : number = -1;
		let my_order_pos : number = -1;
		console.log(json.order);
		for ( i = 0; i < 4; ++i) {
			//me
			if(json.order[i] == my_id){
				this.createGamePlayer(deck,json,i,PlayerType.Me, json.order[i]);
				my_order_pos = i;
			}else if(json.order[i] == team_mate_id){
				this.createGamePlayer(deck,json,i,PlayerType.Friend, json.order[i]);
				friend_order_pos = i;
			}
		}
		console.log('help');
		this.myTurnNumber = my_order_pos;
		this.onTurn = 0;
		let foe1_pos : number = (my_order_pos + 1 > 3 ? 0 : my_order_pos + 1);
		let foe2_pos : number = (my_order_pos - 1 < 0 ? 3 : my_order_pos - 1);
		this.createGamePlayer(deck,json,foe1_pos,PlayerType.Foe1,json.order[foe1_pos]);
		this.createGamePlayer(deck,json,foe2_pos,PlayerType.Foe2,json.order[foe2_pos]);

		this.table = new Table(deck[0]);
		console.log(this.players);
	}

	private getHand(deck: Card[], pos: number, player_id : string) : Card[]{
		let hand : Card[] = [];

		for (var k = pos * 10; k < 9 +(pos*10); ++k) {
			let card: Card = deck[k];
			card.isOnHand = true;
			card.player_id = player_id;
			hand.push(card);
		}
		return hand;
	}

	private getPlayer(json:any,id:string) : any{
		let player : any = null;
		for (var i = 0; i < 2; ++i) {
			if(json.team1[i].id == id){
				player = {id : json.team1[i].id, avatar : json.team1[i].avatar, username : json.team1[i].username, team : 1, team_pos: i};
			}else if(json.team2[i].id == id){
				player = {id : json.team2[i].id, avatar : json.team2[i].avatar, username : json.team2[i].username, team : 2, team_pos: i};
			}
		}
		return player;
	}

	private createGamePlayer(deck:Card[],json:any,i:number,player_type:PlayerType,id:string){
		let player : any = this.getPlayer(json, id);
		let p : GamePlayer = new GamePlayer(player_type, player.avatar, player.username, player.id, player.team,player.team_pos);
		p.hand = this.getHand(deck, i, p.id);
		this.players[i] = p;
	}

	public getHandCards(type:number){
		for (var i = 0; i < 4; ++i) {
			if(this.players[i].type == type){
				return this.players[i].hand;
			}
		}
		return null;
	}
	public getTableCard(type:number){
		for (var i = 0; i < 4; ++i) {
			if(this.players[i].type == type){
				return this.players[i].tableCard;
			}
		}
		return null;
	}
	public played(pos:number , card:Card){
		this.players[pos].updateCard(card);
	}
	public play(pos:number){
		this.onTurn = pos;
		if(this.onTurn == this.myTurnNumber){
			this.isMyTurn = true;
		}
	}
	public getPlayedCard(pos:number){
		return this.players[pos].tableCard;

	}
	public playCard(pos:number){
		if(this.isMyTurn){
			this.players[this.myTurnNumber].playCard(pos);
			this.isMyTurn = false;
			this.checkGame();
			return true;
		}else{
			return false;
		}
		
	}
	public checkGame(){
		
	}



}