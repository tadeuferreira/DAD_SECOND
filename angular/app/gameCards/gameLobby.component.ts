import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { UserService } from '../auth/user.service';
import { GameService } from '../gameCards/game.service';
import { WebSocketService } from '../notifications/websocket.service';

@Component({
    moduleId: module.id,
    selector: 'gamelobby',
    templateUrl:'gameLobby.component.html'

})
export class GameLobbyComponent implements OnInit, OnDestroy{
	id: string;
	private sub: any;
	private players: string[] = [];
	public team1: string[] = [];
	public team2: string[] = [];
	constructor(private websocketService: WebSocketService, private activatedRoute: ActivatedRoute, private gameService: GameService ,private userService: UserService, private router: Router) {}

	 ngOnInit() {
	 	if(!this.userService.isLoggedIn()){
			this.router.navigate(['login']);
		}else{
			 this.sub = this.activatedRoute.params.subscribe(params => {
                this.id = params['id'];
            });

			 console.log(this.id);
			 this.websocketService.getInitLobbyErr().subscribe((p: any) => console.log(p));
			 this.websocketService.getInitLobby().subscribe((p: any) => this.setPlayers(p));
			 this.websocketService.getExitLobby().subscribe((p: any) => { 	
			 	if(p.status == 'terminated'){
			 		this.router.navigate(['dashboard']);
			 	}
			 });
			 this.websocketService.sendInitLobby({_id: this.id, msg: 'Joinning', player:{ _id: sessionStorage.getItem('id') ,username: sessionStorage.getItem('username'), avatar: sessionStorage.getItem('avatar')}});
		}	
    }

    ngOnDestroy() {
    	this.websocketService.sendExitLobby({_id: this.id, player:{ _id: sessionStorage.getItem('id') ,username: sessionStorage.getItem('username'), avatar: sessionStorage.getItem('avatar')}});
    }


    setPlayers(p:string[]){
    	this.team1 = p.team1;
    	this.team2 = p.team2;
    	console.log(p);
    }
	
}