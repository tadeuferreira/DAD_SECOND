import {Card, Suit} from "./card";
import {Hand} from "./hand";
import {GamePlayer, PlayerType} from "./gamePlayer";
import {Table} from "./table";


export class Game{
	public players: GamePlayer[];
	public table: Table;
	public TrumpSuit : Suit;


	public constructor(json: any){
		console.log('help');
		this.players = [];
		this.initializeGame(json);
	}


	private initializeGame(json:any){
		let first_id : string = json.first;
		let first_team : number;
		let first_pos : number;
		let deck : Card[] = [];
		let i : number = 0;
		let my_team : number = 0;
		let my_pos : number = 0;
		console.log(json.pack);
		for (i = 0; i < 40; ++i) {
			deck.push(new Card(json.pack.cards[i].type, json.pack.cards[i].suit, json.pack.cards[i].isOnHand, json.pack.cards[i].isUsed, null, false));
		}
		deck[0].isFirstTrump = true;
		this.TrumpSuit = deck[0].suit;



		for (i = 0; i < 2; ++i) {
			if(json.team1[i].id == first_id){
				first_team = 1;
				first_pos = i;
			}
			if(json.team2[i].id == first_id){
				first_team = 2;
				first_pos = i;
			}
			if(json.team2[i].id == sessionStorage.getItem('id')){
				my_team = 2;
				my_pos = i;
			}else if(json.team1[i].id == sessionStorage.getItem('id')){
				my_team = 1;
				my_pos = i;
			}
		}

		let player_list : any[] = [];
		// third player is first's friend
		player_list.push(first_team == 1 ?  this.getPlayer(json.team1[first_pos],1,first_pos) :  this.getPlayer(json.team2[first_pos],2,first_pos));
		player_list.push(first_team == 1 ?( first_pos == 0 ? this.getPlayer(json.team2[1],2,1) : this.getPlayer(json.team2[0],2,0)) : ( first_pos == 0 ? this.getPlayer(json.team1[1],1,1) : this.getPlayer(json.team1[0],1,0)));
		player_list.push(first_team == 1 ?( first_pos == 0 ? this.getPlayer(json.team1[1],1,1) : this.getPlayer(json.team1[0],1,0)) : ( first_pos == 0 ? this.getPlayer(json.team2[1],2,1) : this.getPlayer(json.team2[0],2,0)));
		player_list.push(first_team == 1 ?( first_pos == 0 ? this.getPlayer(json.team2[0],2,0) : this.getPlayer(json.team2[1],2,1)) : ( first_pos == 0 ? this.getPlayer(json.team1[0],1,0) : this.getPlayer(json.team1[1],1,1)));

		
		let me_pos : number = -1;
		let friend_pos : number = -1;
		for ( i = 0; i < 4; ++i) {
			//me
			if(player_list[i].id == sessionStorage.getItem('id')){
				this.createGamePlayer(deck,player_list,i,PlayerType.Me);
				me_pos = i;
			}else if(player_list[i].team == my_team){
				this.createGamePlayer(deck,player_list,i,PlayerType.Friend);
				friend_pos = i;
			}
		}
		let foe1_pos : number = (me_pos + 1 > 3 ? 1 : me_pos + 1);
		let foe2_pos : number = (me_pos - 1 < 0 ? 3 : me_pos - 1);
		this.createGamePlayer(deck,player_list,foe1_pos,PlayerType.Foe1);
		this.createGamePlayer(deck,player_list,foe2_pos,PlayerType.Foe2);

		console.log(this.players);


	}

	private getHand(deck: Card[], pos: number, owner : GamePlayer) : Hand{
		let hand : Hand = new Hand();

		for (var k = pos * 10; k < 9 +(pos*10); ++k) {
			let card: Card = deck[k];
			card.isOnHand = true;
			card.playerOwner = owner;
			hand.cards.push(card);
		}
		return hand;
	}

	private getPlayer(player:any, team:number, pos:number) : any{
		return {id : player.id, avatar : player.avatar, username : player.username, team : team, team_pos: pos};
	}

	private createGamePlayer(deck:Card[],player_list:any[],i:number,player_type:PlayerType){
		let p : GamePlayer = new GamePlayer(player_type, player_list[i].avatar, player_list[i].username, player_list[i].id);
		p.hand = this.getHand(deck, i, p);
		this.players.push(p);
	}



}