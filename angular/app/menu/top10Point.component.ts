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
  pages: number = 4;
  pageSize: number = 5;
  pageNumber: number = 0;
  currentIndex: number = 1;
  pagesIndex: Array<number>;
  pageStart: number = 1;
  inputName: string = '';

  constructor(private http: Http, private router: Router) {
    this.getTop10Point();
    this.filteredItems = this.arrayTop10Point;
    this.init();
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

  init() {
    this.currentIndex = 1;
    this.pageStart = 1;
    this.pages = 4;

    this.pageNumber = parseInt("" + (this.filteredItems.length / this.pageSize));
    if (this.filteredItems.length % this.pageSize != 0) {
      this.pageNumber++;
    }

    if (this.pageNumber < this.pages) {
      this.pages = this.pageNumber;

    }

    this.refreshItems();
    console.log("this.pageNumber :  " + this.pageNumber);
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
    this.init();
  }

  fillArray(): any {
    var obj = new Array();
    for (var index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;
  }

  refreshItems() {
    this.arrayTop10Point = this.filteredItems.slice((this.currentIndex - 1) * this.pageSize, (this.currentIndex) * this.pageSize);
    this.pagesIndex = this.fillArray();

  }

  prevPage() {
    if (this.currentIndex > 1) {
      this.currentIndex--;
    }
    if (this.currentIndex < this.pageStart) {
      this.pageStart = this.currentIndex;

    }
    this.refreshItems();
  }

  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }

    this.refreshItems();
  }

  setPage(index: number) {
    this.currentIndex = index;
    this.refreshItems();
  }

}


