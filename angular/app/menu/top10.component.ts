import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';

@Component({
    moduleId: module.id,
    selector: 'top10',
    templateUrl: 'top10.component.html'
})
export class Top10Component {
    public arrayTop10: any[] = [];

    constructor(private http: Http, private router: Router) {
        this.getTop10();
    }

    getTop10(){
         let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.get('http://localhost:7777/api/v1/top10', <RequestOptionsArgs>{ headers: headers, withCredentials: false })
        .subscribe(
      response => {
        if(response.ok){
          this.arrayTop10 = response.json();
         // console.log(response.json);
          console.log(this.arrayTop10);
        }
      },
      error => {
        console.log(error.text());
      }
      );
    }

}