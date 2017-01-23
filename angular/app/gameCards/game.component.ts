import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { GameService } from '../gameCards/game.service';
import { WebSocketService } from '../notifications/websocket.service';
import { Game } from '../gameEngine/game';

@Component({
	moduleId: module.id,
	selector: 'game-playing',
	templateUrl:'game.component.html',
	styleUrls:['../gameCards/game.component.css']

})
export class GameComponent implements OnInit, OnDestroy{
	private game_id: string = sessionStorage.getItem('game_id');
	private player_id: string = sessionStorage.getItem('id');
	game : Game;
	public isGameReady:boolean = false;

	constructor(private websocketService: WebSocketService, private gameService: GameService ,private userService: UserService, private router: Router) {}


	ngOnInit(){
		if(!this.userService.isLoggedIn()){
			this.router.navigate(['login']);
		}else{
			this.gameService.getGame().subscribe(
				response => {
					this.game = new Game(response.json());
					this.isGameReady = true;
					this.gameService.ready().subscribe(response => {
						if(response.ok){
							switch (response._body) {
								case '"gameReady"':
								this.websocketService.sendGame({_id: this.game_id, player_id: this.player_id, msg: 'startGame'});
								break;
								case '"ready"':
								//do nothing maybe an alert
								break;	
							}

							this.websocketService.getGame().subscribe((p: any) => { 
								if(p.msg == 'update'){
									this.game.played(p.pos,p.card);						
							}else if(p.msg == 'play'){
								this.game.play(p.pos);
								if(this.game.isMyTurn)
									alert("PLAY");
							}
							},
							error => {
								console.log(error.text());
							}
							);
						}
					});
				});

		}
	}

	ngOnDestroy(){

	}

	getGameId(){
		return this.game_id;
	}

	getHand(type: number){
		return this.game.getHandCards(type);
	}
	getTableCard(type: number){
		return this.game.getTableCard(type);
	}

	playCard(event:any){
		console.log(event);
		if(this.game.playCard(event.target.id)){
			let my :number = this.game.myTurnNumber;
			let next :number = this.game.myTurnNumber +1;
			if( next > 4){

			}
			//this.websocketService.sendGame({_id: this.game_id, player_id: this.player_id, msg: 'endTurn' , my_pos:this.game.myTurnNumber , next_pos:this.game.myTurnNumber++, card: this.game.getPlayedCard(this.game.myTurnNumber)});
			else
			this.websocketService.sendGame({_id: this.game_id, player_id: this.player_id, msg: 'next' , my_pos:this.game.myTurnNumber , next_pos:next, card: this.game.getPlayedCard(my)});
		}
	}
}