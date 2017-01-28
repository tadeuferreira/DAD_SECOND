import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

import { User } from './user';

@Injectable()
export class UserService {
  private loggedIn = false;

  constructor(private http: Http, private router: Router) {
    this.loggedIn = !!sessionStorage.getItem('token');
  }

  login(username: string, password: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post('http://localhost:7777/api/v1/login', JSON.stringify({ username, password }), { headers })
      .subscribe(response => {
        if (response.ok) {
          sessionStorage.setItem('id', response.json()._id);
          sessionStorage.setItem('token', response.json().token);
          sessionStorage.setItem('username', response.json().username);
          sessionStorage.setItem('name', response.json().name);
          sessionStorage.setItem('email', response.json().email);
          sessionStorage.setItem('avatar', response.json().avatar);
          this.loggedIn = true;
          console.log(sessionStorage.getItem('token'));
          this.router.navigate(['dashboard']);
        }
      },
      error => {
        console.log(error.text());
      });
  }

  register(username: string, name: string, email: string, password: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let avatar = 'https://api.adorable.io/avatars/285/' + username + '.png';
    let totalPoints = 0;
    let totalStars = 0;

    return this.http
      .post('http://localhost:7777/api/v1/register', JSON.stringify({ username, name, email, password, avatar, totalPoints, totalStars }), { headers })
      .subscribe(response => {
        this.router.navigate(['login']);
      },
      error => {
        console.log(error.text());
      });
  }

  update(user: User) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    let avatar = user.avatar;
    let username = user.username;
    let name = user.name;
    let email = user.email;
    let password = user.password;

    let body = JSON.stringify({ username, name, email, password, avatar });

    return this.http
      .put('http://localhost:7777/api/v1/players/' + sessionStorage.getItem("id"), body, <RequestOptionsArgs>{ headers: headers, withCredentials: false })
      .subscribe(response => {
        this.router.navigate(['dashboard']);
      },
      error => {
        console.log(error.text());
      });
  }

  getProfile() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    return this.http
      .get('http://localhost:7777/api/v1/players/' + sessionStorage.getItem("id"), <RequestOptionsArgs>{ headers: headers, withCredentials: false });
  }

  logout() {
    sessionStorage.removeItem('auth_token');
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}