import { Component, Input, OnInit } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit{

	@Input() hidden:boolean;
    
    ngOnInit() {
    }
}