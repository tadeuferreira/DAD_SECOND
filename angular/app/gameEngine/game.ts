import {Card, SuitType} from "./card";
import {GamePlayer, PlayerType} from "./gamePlayer";


export class Game{
	public players: GamePlayer[];
	public TrumpSuit : SuitType;

	public onTurn : number;
	public myTurnNumber : number;

	public lastToPlay : number;
	public firstToPlay : number;

	public isMyTurn : boolean;
	public isFirst : boolean;

	public jsonGame : any;
	public roundHasEnded : boolean;


	public constructor(json: any){
		this.players = [null,null,null,null];
		this.initializeGame(json);
		this.jsonGame = json;
		this.isMyTurn = false;
		this.roundHasEnded = false;
	}


	private initializeGame(json:any){
		let deck : Card[] = [];
		let my_team : number = 0;
		let my_id : string = sessionStorage.getItem('id');
		let my_order : number = 0;

		for (var i = 0; i < 40; ++i) {

			deck.splice(i, 0, this.jsonToCard(json.pack.cards[i],i,null));
		}
		deck[0].isFirstTrump = true;
		this.TrumpSuit = deck[0].stype;

		//create myself
		for (var i = 0; i < json.basicOrder.length; ++i) {
			if(json.basicOrder[i] == my_id){
				this.createGamePlayer(deck,json,i,PlayerType.Me,json.basicOrder[i]);
				my_order = i;
			}
		}

		//generate the rest
		let pos : number;
		pos = ( my_order - 2 < 0 ? my_order + 2 : my_order - 2);
		this.createGamePlayer(deck,json,pos,PlayerType.Friend,json.basicOrder[pos]);

		pos = (my_order + 1 > 3 ? 0 : my_order + 1);
		this.createGamePlayer(deck,json,pos,PlayerType.Foe1,json.basicOrder[pos]);

		pos = (my_order - 1 < 0 ? 3 : my_order - 1);
		this.createGamePlayer(deck,json,pos,PlayerType.Foe2,json.basicOrder[pos]);

		// final setup
		this.myTurnNumber = my_order;
		this.onTurn = 0;
		this.lastToPlay = 3;	
		this.isFirst = (this.onTurn == this.myTurnNumber);
		this.firstToPlay = 0;
		this.isMyTurn = this.isFirst;
	}

	private getHand(deck: Card[], pos: number, player_id : string) : Card[]{
		let hand : Card[] = [];

		for (var k = pos * 10; k < 10 +(pos*10); ++k) {
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

	// game functions
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
	}

	public getPlayedCard(pos:number){
		return this.players[pos].tableCard;
	}

	public playCard(pos:number){
		if(this.myTurnNumber == this.onTurn){
			this.players[this.myTurnNumber].playCard(pos);
			this.isMyTurn = false;
			if(this.myTurnNumber == this.lastToPlay){
				this.checkGameRound();

			}
		}
	}

	public checkGameRound(){

		//check if there is a trump
		let trumpCardWinner : Card = null;
		let cardWinner : Card = null;
		let winnerTrump : number;
		let winnerCard : number;

		let winnerTeamNumber : number;
		let winnerTeamPosNumber : number;

		let suit : SuitType = this.players[this.firstToPlay].tableCard.stype;

		for (var i = 0; i < this.players.length; ++i) {
			var card = this.players[i].tableCard;
			if(card.stype == this.TrumpSuit){
				if(trumpCardWinner == null){
					trumpCardWinner = card;
					winnerTrump = i;
				}
				else if(trumpCardWinner.ctype < card.ctype){
					trumpCardWinner = card;
					winnerTrump = i;
				}
			}else{
				if(cardWinner == null){
					if(card.stype == suit){
						cardWinner = card;
						winnerCard = i;	
					}
					
				}else if(cardWinner.ctype < card.ctype && card.stype == suit){
					cardWinner = card;
					winnerCard = i;
				}
			}					
		}
		for (var i = 0; i < this.players.length; ++i) {
			var player = this.players[i];
			var renounce = false;
			if(player.tableCard.stype != this.TrumpSuit && player.tableCard.stype != suit){
				for (var j = 0; j < player.hand.length; ++j) {
					if(player.hand[j].stype == this.TrumpSuit || player.hand[j].stype == suit)
						renounce = true;
				}	
			}
			if(renounce){
				if(player.team == 1){
					this.jsonGame.renounce1 = true;
				}else{
					this.jsonGame.renounce2 = true;
				}
			}	
		}
		if(trumpCardWinner != null){
			//add cards 
			this.winHand(winnerTrump);
			this.firstToPlay = winnerTrump;
			winnerTeamNumber = this.players[winnerTrump].team;
			winnerTeamPosNumber = this.players[winnerTrump].team_pos;
		}else{
			this.winHand(winnerCard);
			this.firstToPlay = winnerCard;
			winnerTeamNumber = this.players[winnerCard].team;
			winnerTeamPosNumber = this.players[winnerCard].team_pos;
		}
		console.log('set toundhasEnded = true')
		this.roundHasEnded = true;
		this.lastToPlay = ( this.firstToPlay - 1 < 0 ? 3 : this.firstToPlay - 1);
		console.log( this.firstToPlay + ' ' +this.lastToPlay);
		this.updateJsonGame();
	}

	private winHand(winnerPos: number){
		for (var i = 0; i < this.players.length; ++i) {
			var card = this.players[i].tableCard;
			card.isUsed = true;
			card.isOnHand = false;
			card.isOnTable = false;
			this.players[winnerPos].stash.push(card);
		}
	}
	private updateJsonGame(){

		let pack : any = [];
		console.log(pack);
		console.log(this.jsonGame);
		
		for (var i = 0; i < this.players.length; ++i) {
			var player = this.players[i];
			for (var k = 0; k < player.hand.length; ++k) {
				pack.push(this.cardToJson(player.hand[k], player.id));
			}
			for (var k = 0; k < player.stash.length; ++k) {
				pack.push(this.cardToJson(player.stash[k], player.id));
			}
		}
		console.log(pack);
		this.jsonGame.pack = pack;
		for (var i = 0; i < 2; ++i) {
			this.jsonGame.team1[i].ready = false;
			this.jsonGame.team2[i].ready = false;
		}

	}

	private cardToJson(card : Card , owner_id: string){
		return {type : card.ctype, suit : card.stype, isOnHand : card.isOnHand, isOnTable : card.isOnTable, isUsed : card.isUsed, playerOwner : owner_id, isTrump : (card.stype == this.TrumpSuit), isFirstTrump: card.isFirstTrump};
	}
	private jsonToCard(card:any, i:number , owner:string){
		return new Card(i,card.type, card.suit, card.isOnHand, card.isOnTable, card.isUsed, owner, card.isFirstTrump);	
	}

	public update(json:any, response:any){

		this.jsonGame = json.game;
		this.firstToPlay = response.firstToPlay;
		this.lastToPlay = response.lastToPlay;
		this.onTurn = this.firstToPlay;
		this.isMyTurn = this.myTurnNumber == this.firstToPlay;
		this.isFirst = this.isMyTurn;
		this.roundHasEnded = false;
		console.log(this.isFirst);
		console.log(this.isMyTurn);
		console.log(this.onTurn);
		console.log(this.lastToPlay);
		console.log(this.firstToPlay);

		for (var i = 0; i < this.players.length; ++i) {
			var player = this.players[i];
			var hand = [];
			var stash = [];
			for (var k = 0; k < json.pack.length; ++k) {
				var card = json.pack[k];
				if(card.playerOwner == player.id){
					if(card.isUsed == true){
						stash.push(this.jsonToCard(card,k,player.id));
					}else if(card.isOnHand == true){
						hand.push(this.jsonToCard(card,k,player.id));
					}
				}
			}
			player.tableCard = null;
			player.stash = stash;
			player.hand = hand;
		}
	}
}