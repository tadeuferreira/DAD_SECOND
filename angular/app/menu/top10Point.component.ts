import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';

@Component({
    moduleId: module.id,
    selector: 'top10Point',
    templateUrl: 'top10Point.component.html'
})
export class Top10PointComponent {
    public arrayTop10Point: any[] = [];

    constructor(private http: Http, private router: Router) {
        this.getTop10Point();
    }

    getTop10Point(){
         let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.get('http://localhost:7777/api/v1/top10Points', <RequestOptionsArgs>{ headers: headers, withCredentials: false })
        .subscribe(
      response => {
        if(response.ok){
          this.arrayTop10Point = response.json();
         // console.log(response.json);
          console.log(this.arrayTop10Point);
        }
      },
      error => {
        console.log(error.text());
      }
      );
    }

}
