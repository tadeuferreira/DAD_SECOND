import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { GameService } from '../gameCards/game.service';
import { WebSocketService } from '../notifications/websocket.service';


@Component({
	moduleId: module.id,
	selector: 'game-playing',
	templateUrl:'game.component.html',
	styleUrls:['../gameCards/game.component.css']

})
export class GameComponent implements OnInit, OnDestroy{
	private game_id: string = sessionStorage.getItem('game_id');
	private player_id: string = sessionStorage.getItem('id');
	public isMyTurn = false;
	public isGameReady:boolean = false;
	public message : string = 'Wait';

	public me : any = {cards : null, order: null, tableCard: null};
	public friend : any = {cards : null, order: null, tableCard: null};
	public foe1: any = {cards : null, order: null, tableCard: null};
	public foe2: any = {cards : null, order: null, tableCard: null};


	constructor(private websocketService: WebSocketService, private gameService: GameService ,private userService: UserService, private router: Router) {}


	ngOnInit(){
		if(!this.userService.isLoggedIn()){
			this.router.navigate(['login']);
		}else{
			console.log(this.player_id);
			this.websocketService.sendGame({_id: this.game_id, player_id: this.player_id, msg:'gameJoin'});
			this.websocketService.subGame().subscribe(response => {
				console.log(response);
				switch (response.msg) {
					case 'update':
					this.websocketService.sendGame({_id: this.game_id, player_id: this.player_id, msg:'update'});
					break;	
					case 'hand':
					this.loadHands(response);
					break;
					case 'play':
					this.isMyTurn = (response.order == this.me.order);
					if(this.isMyTurn) this.message = 'Play!';
					break;
					case 'played':
					this.loadPlayedCard(response);
					break;
					case 'wonRound':
					this.loadRoundWon(response);
					break;
				}
			},
			error => {
				console.log(error.text());
			});
		}
	}

	ngOnDestroy(){
		this.websocketService.sendGame({_id: this.game_id, player_id: this.player_id, msg:'leave'});
		this.websocketService.unsubGame();
	}

	getGameId(){
		return this.game_id;
	}

	playCard(event:any){
		if(this.isMyTurn){
			let id = event.target.id;
			let card : any;
			for (var i = 0; i < this.me.cards.length; ++i) {
				if(this.me.cards[i].id == id)
					card = this.me.cards[i];
			}
			if(card != null)
				this.websocketService.sendGame({_id: this.game_id, player_id: this.player_id, msg:'try', card: card});
		}
	}

	loadHands(response : any){
		console.log(response);

		this.me.cards = this.loadMyCard(response.me.cards);
		this.me.order = response.me.order;
		this.me.tableCard = this.cardToImage(response.table.me);

		this.friend.cards = this.loadOthersHand(response.friend.cards);
		this.friend.order = response.friend.order;
		this.friend.tableCard = this.cardToImage(response.table.friend);

		this.foe1.cards = this.loadOthersHand(response.foe1.cards);
		this.foe1.order = response.foe1.order;
		this.foe1.tableCard = this.cardToImage(response.table.foe1);

		this.foe2.cards = this.loadOthersHand(response.foe2.cards);
		this.foe2.order = response.foe2.order;
		this.foe2.tableCard = this.cardToImage(response.table.foe2);
		console.log(this.me.tableCard);
		console.log(this.friend.tableCard);
		console.log(this.foe1.tableCard);
		console.log(this.foe2.tableCard);

		this.isGameReady = true;
	}

	loadRoundWon ( response : any){
		console.log(response.order == this.me.order);
		if(response.order == this.me.order){
			this.message = 'you won the round !!!';
			setTimeout(() => {  
				this.websocketService.sendGame({_id: this.game_id, player_id: this.player_id, msg:'startRound'});
			}, 5000);	
		}else{
			this.message = response.order + ' won the round !!!';
			console.log(this.message);
		}
	}

	loadPlayedCard(response : any){
		console.log(response)
		if(this.me.order == response.order){
			this.me.tableCard = response.card;
		}if(this.friend.order == response.order){
			this.friend.tableCard = response.card;
		}if(this.foe1.order == response.order){
			this.foe1.tableCard = response.card;
		}if(this.foe2.order == response.order){
			this.foe2.tableCard = response.card;
		}
	}

	/*clearOtherPlayedCard(original:any,card:any): any{
		let cards : any = [];
		let isTrump : boolean = card.isFirstTrump;
		for (var i = 0; i < original.length; ++i) {
			if(!isTrump){

			}
		}
		return cards;
	}*/

	loadMyCard(cards : any) : any{
		let array : any = [];
		for (var i = 0; i < cards.length; ++i) {
			array.push(this.cardToImage(cards[i]));
		}
		return array;
	}

	loadOthersHand(cards : any) : any{
		let array : any = [];
		for (var i = 0; i < cards.length; ++i) {
			if(cards[i].dummy)
				array.push({imgUrl: '/img/cards/semFace.png'});
			else
				array.push(this.cardToImage(cards[i]));
		}
		return array;
	}

	cardToImage(card:any) : any{
		if(card != null){
			switch (card.suit) {
				case 0: 
				card.imgUrl = "/img/cards/c";
				break;
				case 1:
				card.imgUrl = "/img/cards/e";
				break;
				case 2:
				card.imgUrl = "/img/cards/p";
				break;
				case 3:
				card.imgUrl = "/img/cards/o";
				break;
			}

			if(card.type <= 4){
				card.imgUrl += (card.type+2)+'.png';
			}else if(card.type <= 7 ){
				card.imgUrl += (card.type+6)+'.png';
			}else if(card.type == 9){
				card.imgUrl += 1+'.png';
			}else if(card.type == 8){
				card.imgUrl += 7+'.png';
			}
		}
		return card;
	}

}