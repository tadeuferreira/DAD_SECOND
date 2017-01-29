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
  filteredItems: any[];
  inputName: string = '';

  constructor(private http: Http, private router: Router) {
    this.getTop10Point();
    this.filteredItems = this.arrayTop10Point;
  }

  getTop10Point() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.get('http://localhost:7777/api/v1/top10Points', <RequestOptionsArgs>{ headers: headers, withCredentials: false })
      .subscribe(
      response => {
        if (response.ok) {
          this.arrayTop10Point = response.json();
        }
      },
      error => {
        console.log(error.text());
      }
      );
  }
  FilterByName() {
    this.filteredItems = [];

    if (this.inputName != "") {
      this.arrayTop10Point.forEach(element => {
        if (element.name.toUpperCase().indexOf(this.inputName.toUpperCase()) >= 0) {
          this.filteredItems.push(element);
        }
      });
    } else {
      this.filteredItems = this.arrayTop10Point;
    }
    console.log(this.filteredItems);
    this.refreshItems();
  }

  refreshItems() {
    this.arrayTop10Point = this.filteredItems;
  }
}


