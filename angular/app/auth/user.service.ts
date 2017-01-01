import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  private loggedIn = false;

  constructor(private http: Http) {
    this.loggedIn = !!localStorage.getItem('auth_token');
  }

  login(username: string, password: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post(
        'http://localhost:7777/api/v1/login', 
        JSON.stringify({ username, password }), 
        { headers }
      )
      .map(res => res.json())
      .map((res) => {
        if (res.success) {
          localStorage.setItem('auth_token', res.auth_token);
          this.loggedIn = true;
        }

        return res.success;
      });
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
      .map(res => res.json())
      .map((res) => {
        if (res.success) {
          this.login(username, password);
        }
      });
  }
  
  logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}