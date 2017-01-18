import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';

@Component({
    moduleId: module.id,
    selector: 'top10Star',
    templateUrl: 'top10Star.component.html'
})
export class Top10StarComponent {
    public arrayTop10Star: any[] = [];

    constructor(private http: Http, private router: Router) {
        this.getTop10Star();
    }

    getTop10Star(){
         let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.get('http://localhost:7777/api/v1/top10Stars', <RequestOptionsArgs>{ headers: headers, withCredentials: false })
        .subscribe(
      response => {
        if(response.ok){
          this.arrayTop10Star = response.json();
         // console.log(response.json);
          console.log(this.arrayTop10Star);
        }
      },
      error => {
        console.log(error.text());
      }
      );
    }

}
