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
          localStorage.setItem('auth_token', response.auth_token);
          this.loggedIn = true;
          this.router.navigate(['dashboard']);
        }
      },
      error => {
        alert(error.text());
        console.log(error.text());
      }
      );
    }
    register(username: string, email: string, password: string) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http
      .post(
        'http://localhost:7777/api/v1/register', 
        JSON.stringify({ username, email ,password }), 
        { headers }
        )
      .subscribe(
        response => {
          this.router.navigate(['login']);
        },
        error => {
          alert(error.text());
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