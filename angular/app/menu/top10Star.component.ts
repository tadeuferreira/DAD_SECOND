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
  filteredItems: any[];
  inputName: string = '';

  constructor(private http: Http, private router: Router) {
    this.getTop10Star();
    this.filteredItems = this.arrayTop10Star;
  }

  getTop10Star() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.get('http://localhost:7777/api/v1/top10Stars', <RequestOptionsArgs>{ headers: headers, withCredentials: false })
      .subscribe(
      response => {
        if (response.ok) {
          this.arrayTop10Star = response.json();
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
      this.arrayTop10Star.forEach(element => {
        if (element.name.toUpperCase().indexOf(this.inputName.toUpperCase()) >= 0) {
          this.filteredItems.push(element);
        }
      });
    } else {
      this.filteredItems = this.arrayTop10Star;
    }
    console.log(this.filteredItems);
    this.refreshItems();
  }
  
  refreshItems() {
    this.arrayTop10Star = this.filteredItems;
  }
}
