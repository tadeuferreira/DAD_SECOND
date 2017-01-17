import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  private loggedIn = false;

  constructor(private http: Http, private router: Router) {
    this.loggedIn = !!localStorage.getItem('auth_token');
  }

  login(username: string, password: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
    .post('http://localhost:7777/api/v1/login', JSON.stringify({ username, password }),{ headers }).subscribe(
      response => {
        if(response.ok){
          sessionStorage.setItem('id', response.json()._id);
          sessionStorage.setItem('token', response.json().token);
          sessionStorage.setItem('username', response.json().username);
          sessionStorage.setItem('email', response.json().email);
          sessionStorage.setItem('avatar', response.json().avatar);
          this.loggedIn = true;
          console.log(sessionStorage.getItem('token'));
          this.router.navigate(['dashboard']);
        }
      },
      error => {
        console.log(error.text());
      }
      );
    }
    register(username: string, email: string, password: string) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let avatar = 'https://api.adorable.io/avatars/285/'+email+'.png';
      return this.http
      .post(
        'http://localhost:7777/api/v1/register', 
        JSON.stringify({ username, email ,password, avatar}), 
        { headers }
        )
      .subscribe(
        response => {
          this.router.navigate(['login']);
        },
        error => {
          console.log(error.text());
        }
        );
    }

    logout() {
      localStorage.removeItem('auth_token');
      this.loggedIn = false;
    }

    isLoggedIn() {
      return this.loggedIn;
    }
  }