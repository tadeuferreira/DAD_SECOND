import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { UserService } from '../auth/user.service';
import { GameService } from '../gameCards/game.service';
import { WebSocketService } from '../notifications/websocket.service';
import { Player } from '../gameEngine/player';

@Component({
    moduleId: module.id,
    selector: 'gamelobby',
    template:'<h1>Lobby</h1>'

})
export class GameLobbyComponent implements OnInit, OnDestroy{
	id: string;
	private sub: any;
	private players: Player[];
	constructor(private websocketService: WebSocketService, private activatedRoute: ActivatedRoute, private gameService: GameService ,private userService: UserService, private router: Router) {}

	 ngOnInit() {
	 	if(!this.userService.isLoggedIn()){
			this.router.navigate(['login']);
		}else{
			 this.sub = this.activatedRoute.params.subscribe(params => {
                this.id = params['id'];
            });

			 console.log(this.id);
			 this.players = [];

			 this.websocketService.getInitLobby().subscribe((p: any) => this.players.push(<Player> p));
			 this.websocketService.sendInitLobby({_id: this.id, msg: 'Joinning', player:{ _id: sessionStorage.getItem('id') ,username: sessionStorage.getItem('username'), avatar: sessionStorage.getItem('avatar')}});
		}	
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
	
}