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
	public message : string = 'Wait';

	constructor(private websocketService: WebSocketService, private gameService: GameService ,private userService: UserService, private router: Router) {}


	ngOnInit(){
		if(!this.userService.isLoggedIn()){
			this.router.navigate(['login']);
		}else{
			this.gameService.getGame().subscribe(
				response => {
					console.log(this.game_id);
					this.game = new Game(response.json());
					this.isGameReady = true;
					this.gameService.ready().subscribe(response => {
						if(response.ok){
							switch (response._body) {
								case '"gameReady"':
								console.log('gameReady');
								this.websocketService.sendGame({_id: this.game_id, player_id: this.player_id, msg: 'startGame'});
								break;
								case '"gameStartedAlready"':
								console.log('gameStartedAlready');
								this.game.play(0);
								break;	
							}

							this.websocketService.getGame().subscribe((p: any) => { 
								if(p.msg == 'update'){
									this.game.played(p.pos,p.card);						
								}else if(p.msg == 'play'){
									console.log(p);
									this.game.play(p.pos);
									if(this.game.myTurnNumber == this.game.onTurn)
										this.message = 'Play';
								}else if(p.msg == 'updateRound'){
									this.message = 'Won: '+p.firstToPlay;
									this.game.played(p.pos,p.card);
									console.log('updating');
									setTimeout(() => {
										this.gameService.getGame().subscribe(response =>{
											console.log('updating inner 1');
											var jsonGame = response.json();
											this.game.update(jsonGame, p);
											this.gameService.ready().subscribe(response => {
												console.log('updating inner 2');
												if(response.ok){
													console.log('updating inner 3');
													this.message = 'Wait';
													if(response._body == '"gameReady"'){
														this.websocketService.sendGame({_id: this.game_id, player_id: this.player_id, pos: this.game.firstToPlay,msg: 'startRound'});
													}
												}
											});
										});
									}, 2000);
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
		this.websocketService.unsubGame();
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
		let my :number = this.game.myTurnNumber;
		let next: number = (my + 1 > 3 ? 0 : my + 1);
		console.log(this.game.onTurn);
		console.log(this.game.myTurnNumber);
		console.log(my == this.game.onTurn);
		if(my == this.game.onTurn){
			this.game.playCard(event.target.id);
			this.message = 'Wait';
			console.log(this.game.roundHasEnded);
			console.log(this.game.firstToPlay);
			console.log(this.game.lastToPlay);
			if(this.game.roundHasEnded){
				console.log(this.game.roundHasEnded);
				this.gameService.updateGame(this.game.jsonGame).subscribe(response => {
					console.log('updated game');
					if(response.ok){
						this.websocketService.sendGame({
							_id: this.game_id, 
							player_id: this.player_id, 
							msg: 'endRound' , 
							my_pos: my, 
							firstToPlay:this.game.firstToPlay,
							lastToPlay:this.game.lastToPlay, 
							card: this.game.getPlayedCard(my)});
					}		
				},
				error => {
					console.log(error.text());
				}
				);
			}else{
				console.log('playing');
				this.websocketService.sendGame({
					_id: this.game_id, 
					player_id: this.player_id, 
					msg: 'next' , 
					my_pos: this.game.myTurnNumber, 
					next_pos:next, 
					card: this.game.getPlayedCard(my)});
			}
		}
	}
}