import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class GameService {

  constructor(private http: Http, private router: Router) {}


  createGame() {

		let playerInfo: any = {_id: sessionStorage.getItem('id'), username: sessionStorage.getItem('username')};

		let body = JSON.stringify({ player: playerInfo, state: 'pending', creationDate: Date.now()});
		
		let headers = new Headers();
		console.log(sessionStorage.getItem('token'));
		headers.append('Content-Type', 'application/json');
		headers.append('Authorization', 'bearer ' + sessionStorage.getItem('token'));
		console.log(body);
		this.http
			.post('http://localhost:7777/api/v1/games', body, <RequestOptionsArgs>{ headers: headers, withCredentials: false })
			.subscribe(response => {
				if (response.ok) {
					this.router.navigate(['game', response.json()._id]);
				}
			}, error => {
				console.log(error);
			}


			);
	}

	getGames(){
		let headers = new Headers();
		console.log(sessionStorage.getItem('token'));
		headers.append('Content-Type', 'application/json');
		headers.append('Authorization', 'bearer ' + sessionStorage.getItem('token'));
		return this.http.get('http://localhost:7777/api/v1/games', <RequestOptionsArgs>{ headers: headers, withCredentials: false });
	}

}